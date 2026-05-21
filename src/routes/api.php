<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/me', function (Request $request) {
	// If the request is already authenticated (session or bearer), return it.
	if ($request->user()) {
		return new UserResource($request->user());
	}

	// Fallback: check for a `token` cookie containing a personal access token.
	$token = $request->cookie('token');
	if (! $token) {
		return response()->json(null, 401);
	}

	$tokenModel = PersonalAccessToken::findToken($token);
	if (! $tokenModel) {
		return response()->json(null, 401);
	}

	$user = $tokenModel->tokenable;

	return new UserResource($user);
});
