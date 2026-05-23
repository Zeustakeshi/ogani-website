<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatbotService;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ChatbotController extends Controller
{
    public function __construct(private ChatbotService $chatbotService)
    {
    }

    public function stream(Request $request)
    {
        $validated = $request->validate([
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant,system'],
            'messages.*.content' => ['required', 'string'],
        ]);

        $user = $this->resolveAuthenticatedUser($request);

        return response()->stream(function () use ($validated, $user): void {
            $this->chatbotService->stream(
                $validated['messages'],
                $user,
                onChunk: function (string $chunk): void {
                    if (str_starts_with($chunk, 'event: ')) {
                        echo $chunk;
                    } else {
                        echo 'data: ' . json_encode(['content' => $chunk], JSON_UNESCAPED_UNICODE) . "\n\n";
                    }

                    if (ob_get_level() > 0) {
                        ob_flush();
                    }

                    flush();
                },
                onDone: function (): void {
                    echo "data: [DONE]\n\n";

                    if (ob_get_level() > 0) {
                        ob_flush();
                    }

                    flush();
                }
            );
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }

    private function resolveAuthenticatedUser(Request $request): ?Authenticatable
    {
        $user = $request->user();

        if ($user) {
            return $user;
        }

        $token = $request->bearerToken() ?: $request->cookie('token');

        if (! $token) {
            return null;
        }

        $tokenModel = PersonalAccessToken::findToken($token);

        if (! $tokenModel) {
            return null;
        }

        $tokenable = $tokenModel->tokenable;

        return $tokenable instanceof Authenticatable ? $tokenable : null;
    }
}