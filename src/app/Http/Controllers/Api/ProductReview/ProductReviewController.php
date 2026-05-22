<?php

namespace App\Http\Controllers\Api\ProductReview;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductReview\StoreProductReviewRequest;
use App\Http\Resources\ProductReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function index(Request $request, Product $product)
    {
        $perPage = max(1, (int) $request->integer('per_page', 10));

        return ProductReviewResource::collection(
            $product->productReviews()
                ->with('user')
                ->latest()
                ->paginate($perPage)
        );
    }

    public function store(StoreProductReviewRequest $request, Product $product): JsonResponse
    {
        $existingReview = ProductReview::query()
            ->where('product_id', $product->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Bạn chỉ được phép đánh giá sản phẩm này một lần. Hãy chỉnh sửa review hiện tại của bạn.',
            ], 409);
        }

        $review = ProductReview::query()->create([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
            'review_text' => $request->validated()['review_text'],
            'rating' => $request->validated()['rating'],
        ]);

        $review->load(['user', 'product']);

        return response()->json(new ProductReviewResource($review), 201);
    }

    public function update(StoreProductReviewRequest $request, Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id || $review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Bạn chỉ có thể chỉnh sửa review của chính mình.',
            ], 403);
        }

        $review->update([
            'review_text' => $request->validated()['review_text'],
            'rating' => $request->validated()['rating'],
        ]);

        $review->load(['user', 'product']);

        return response()->json(new ProductReviewResource($review));
    }

    public function destroy(Request $request, Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id || $review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Bạn chỉ có thể xóa review của chính mình.',
            ], 403);
        }

        $review->delete();

        return response()->json(null, 204);
    }
}