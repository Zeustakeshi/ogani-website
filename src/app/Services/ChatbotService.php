<?php

namespace App\Services;

use App\Tools\GetActiveCouponsTool;
use App\Tools\GetCategoryListTool;
use App\Tools\GetOrderStatusTool;
use App\Tools\GetProductInfoTool;
use App\Tools\SearchProductsTool;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;
use Prism\Prism\Streaming\Events\ToolCallEvent;
use Prism\Prism\Streaming\Events\ToolResultEvent;
use Prism\Prism\Streaming\Events\TextDeltaEvent;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;
use Prism\Prism\ValueObjects\Messages\SystemMessage;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use RuntimeException;
use Illuminate\Contracts\Auth\Authenticatable;

class ChatbotService
{
    private string $model;

    private string $systemPrompt;

    public function __construct()
    {
        $this->model = (string) config('openai.model', 'gpt-4o-mini');

        $this->systemPrompt = implode("\n", [
            'Bạn là trợ lý chăm sóc khách hàng thân thiện cho cửa hàng Ogani.',
            'Hãy trả lời bằng tiếng Việt tự nhiên, ngắn gọn, rõ ràng và hữu ích.',
            'Ưu tiên tư vấn sản phẩm, trạng thái đơn hàng, tồn kho và mua sắm.',
            'Bạn có thể dùng tool để tra cứu danh mục, gợi ý nhiều sản phẩm theo nhu cầu và kiểm tra coupon còn hạn.',
            'Khi cần, hãy dùng tool để tra cứu dữ liệu chính xác thay vì đoán.',
            'Nếu không đủ dữ liệu, hãy nói rõ điều đó và đề nghị khách hàng cung cấp thêm thông tin.',
            'Không lặp lại yêu cầu "mã đơn" nhiều lần: nếu khách hàng không biết mã đơn, hãy hướng dẫn các lựa chọn thay thế (email, số điện thoại, tên tài khoản, thời gian mua).',
            'Nếu người dùng đã xác thực (authenticated), bạn có thể tra cứu đơn hàng theo `user id` của họ; trong trường hợp đó, không hỏi mã đơn mà hãy tra cứu và báo cáo các đơn gần nhất.',
            'Tránh yêu cầu thông tin nhạy cảm không cần thiết; nếu cần thông tin riêng tư, yêu cầu người dùng đăng nhập hoặc xác minh qua kênh an toàn.',
        ]);
    }

    /**
     * @param  array<int, array{role: string, content: mixed}>  $messages
     */
    public function stream(array $messages, ?Authenticatable $user, callable $onChunk, callable $onDone): void
    {
        $tools = [
            (new GetOrderStatusTool())->toPrismTool(),
            (new GetProductInfoTool())->toPrismTool(),
            (new SearchProductsTool())->toPrismTool(),
            (new GetCategoryListTool())->toPrismTool(),
            (new GetActiveCouponsTool())->toPrismTool(),
        ];

        try {
            $stream = Prism::text()
                ->using(Provider::OpenAI, $this->model, config('prism.providers.openai', []))
                ->withSystemPrompt($this->systemPrompt)
                ->withMessages($this->buildPrismMessages($messages, $user))
                ->withTools($tools)
                ->withMaxSteps(5)
                ->asStream();

            foreach ($stream as $event) {
                if ($event instanceof ToolCallEvent) {
                    $onChunk($this->formatStreamEvent('tool_call', [
                        'tool_name' => $event->toolCall->name,
                    ]));

                    continue;
                }

                if ($event instanceof ToolResultEvent) {
                    $onChunk($this->formatStreamEvent('tool_result', [
                        'tool_name' => $event->toolResult->toolName,
                    ]));

                    continue;
                }

                if ($event instanceof TextDeltaEvent && $event->delta !== '') {
                    $onChunk($event->delta);
                }
            }
        } catch (\Throwable $e) {
            report($e);
            $onChunk('Xin lỗi, hiện tại dịch vụ AI đang tạm thời không khả dụng. Vui lòng thử lại sau.');
        } finally {
            $onDone();
        }
    }

    /**
     * @param  array<int, array{role: string, content: mixed}>  $messages
     * @return array<int, UserMessage|AssistantMessage|SystemMessage>
     */
    public function buildPrismMessages(array $messages, ?Authenticatable $user = null): array
    {
        $prismMessages = [];

        if ($user) {
            $userInfoParts = [
                'id=' . $user->getAuthIdentifier(),
            ];

            $username = data_get($user, 'username');
            if (is_string($username) && $username !== '') {
                $userInfoParts[] = 'username=' . $username;
            }

            $email = data_get($user, 'email');
            if (is_string($email) && $email !== '') {
                $userInfoParts[] = 'email=' . $email;
            }

            $phone = data_get($user, 'phone');
            if (is_string($phone) && $phone !== '') {
                $userInfoParts[] = 'phone=' . $phone;
            }

            $prismMessages[] = new SystemMessage('Authenticated user: ' . implode(', ', $userInfoParts));
        }

        foreach ($messages as $message) {
            $role = $message['role'] ?? '';
            $content = $message['content'] ?? '';

            if (! is_string($role)) {
                continue;
            }

            $textContent = $this->extractTextContent($content);

            if ($textContent === '') {
                continue;
            }

            $prismMessages[] = match ($role) {
                'user' => new UserMessage($textContent),
                'assistant' => new AssistantMessage($textContent),
                'system' => new SystemMessage($textContent),
                default => throw new RuntimeException("Unsupported chatbot message role: {$role}"),
            };
        }

        return $prismMessages;
    }

    /**
     * @param  mixed  $content
     */
    private function extractTextContent(mixed $content): string
    {
        if (is_string($content)) {
            return trim($content);
        }

        if (! is_array($content)) {
            return '';
        }

        $parts = [];

        foreach ($content as $item) {
            if (is_string($item)) {
                $parts[] = $item;
                continue;
            }

            if (is_array($item) && isset($item['text']) && is_string($item['text'])) {
                $parts[] = $item['text'];
            }
        }

        return trim(implode(' ', $parts));
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function formatStreamEvent(string $eventName, array $payload): string
    {
        return 'event: ' . $eventName . "\n" . 'data: ' . json_encode($payload, JSON_UNESCAPED_UNICODE) . "\n\n";
    }
}