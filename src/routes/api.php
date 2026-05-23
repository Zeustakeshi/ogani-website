<?php

use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\ProductReview\ProductReviewController;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Coupon\CouponController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\Cart\CartController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\Order\AdminOrderController;
use App\Http\Controllers\Api\Payment\MomoController;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);
Route::post('/chatbot/stream', [ChatbotController::class, 'stream']);

Route::middleware('auth:sanctum')->group(function () {
	Route::get('/cart', [CartController::class, 'index']);
	Route::get('/cart/summary', [CartController::class, 'summary']);
	Route::post('/cart/items', [CartController::class, 'store']);
	Route::match(['put', 'patch'], '/cart/items/{product}', [CartController::class, 'update']);
	Route::delete('/cart/items/{product}', [CartController::class, 'destroy']);
	Route::get('/orders', [OrderController::class, 'index']);
	Route::get('/orders/{order}', [OrderController::class, 'show']);
	 Route::post('/payment/momo/checkout', [MomoController::class, 'checkout']);
	 Route::post('/payment/momo/callback', [MomoController::class, 'callback']);
	Route::post('/products/{product}/reviews', [ProductReviewController::class, 'store']);
	Route::match(['put', 'patch'], '/products/{product}/reviews/{review}', [ProductReviewController::class, 'update']);
	Route::delete('/products/{product}/reviews/{review}', [ProductReviewController::class, 'destroy']);

	Route::middleware('admin')->group(function () {
		Route::post('/categories', [CategoryController::class, 'store']);
		Route::match(['put', 'patch'], '/categories/{category}', [CategoryController::class, 'update']);
		Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
		Route::get('/coupons', [CouponController::class, 'index']);
		Route::get('/coupons/{coupon}', [CouponController::class, 'show']);

		Route::post('/coupons', [CouponController::class, 'store']);
		Route::match(['put', 'patch'], '/coupons/{coupon}', [CouponController::class, 'update']);
		Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy']);

		Route::get('/admin/orders', [AdminOrderController::class, 'index']);

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
