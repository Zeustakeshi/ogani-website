<?php

use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\ProductReview\ProductReviewController;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Cart\CartController;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
	Route::get('/cart', [CartController::class, 'index']);
	Route::get('/cart/summary', [CartController::class, 'summary']);
	Route::post('/cart/items', [CartController::class, 'store']);
	Route::match(['put', 'patch'], '/cart/items/{product}', [CartController::class, 'update']);
	Route::delete('/cart/items/{product}', [CartController::class, 'destroy']);
	Route::post('/products/{product}/reviews', [ProductReviewController::class, 'store']);
	Route::match(['put', 'patch'], '/products/{product}/reviews/{review}', [ProductReviewController::class, 'update']);
	Route::delete('/products/{product}/reviews/{review}', [ProductReviewController::class, 'destroy']);

	Route::middleware('admin')->group(function () {
		Route::post('/categories', [CategoryController::class, 'store']);
		Route::match(['put', 'patch'], '/categories/{category}', [CategoryController::class, 'update']);
		Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

		Route::post('/products', [ProductController::class, 'store']);
		Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update']);
		Route::delete('/products/{product}', [ProductController::class, 'destroy']);
	});
});

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
