<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Token expiration minutes (fallback to 1 day)
// Evaluate env() at runtime inside the controller class.

class AuthController extends Controller
{
	public function __construct(private AuthService $authService)
	{
	}

	private static function tokenExpiresMinutes(): int
	{
		return (int) env('TOKEN_EXPIRES', 1440);
	}

	public function register(RegisterRequest $request): JsonResponse
	{
		$result = $this->authService->register($request->validated());
		$cookie = cookie('token', $result['token'], self::tokenExpiresMinutes(), '/');

		return response()->json([
			'message' => 'Registration successful',
			'user' => new UserResource($result['user']),
			'token' => $result['token'],
			'token_type' => 'Bearer',
			'expires_in' => self::tokenExpiresMinutes() * 60,
		], 201)->withCookie($cookie);
	}

	public function login(LoginRequest $request): JsonResponse
	{
		$result = $this->authService->login($request->validated());

		$cookie = cookie('token', $result['token'], self::tokenExpiresMinutes(), '/');

		return response()->json([
			'message' => 'Login successful',
			'user' => new UserResource($result['user']),
			'token' => $result['token'],
			'token_type' => 'Bearer',
			'expires_in' => self::tokenExpiresMinutes() * 60,
		], 200)->withCookie($cookie);
	}

	public function logout(Request $request): JsonResponse
	{
		$user = $request->user();

		if ($user && $user->currentAccessToken()) {
			$user->currentAccessToken()->delete();
		}

		$cookie = cookie('token', '', -1, '/');

		return response()->json(['message' => 'Logged out'], 200)->withCookie($cookie);
	}
}
