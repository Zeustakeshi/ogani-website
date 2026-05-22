<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
	public function __construct(private ProductService $productService)
	{
	}

	public function index(Request $request)
	{
		$perPage = max(1, (int) $request->integer('per_page', $request->integer('limit', 12)));
		$categoryId = $request->query('category_id');
		$search = $request->query('search');
		$sortBy = $request->query('sort_by');
		$order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

		$query = Product::query();

		if ($categoryId) {
			$query->where('category_id', $categoryId);
		}

		if ($search) {
			$query->where('name', 'like', "%{$search}%")
				->orWhere('description', 'like', "%{$search}%");
		}

		$allowedSorts = ['rating', 'price', 'created_at', 'name'];
		if ($sortBy && in_array($sortBy, $allowedSorts, true)) {
			// Special-case rating: sort by rating desc, then reviews desc as tiebreaker
			if ($sortBy === 'rating') {
				if ($order === 'desc') {
					$query->orderByDesc('rating')->orderByDesc('reviews');
				} else {
					$query->orderBy('rating', 'asc')->orderBy('reviews', 'asc');
				}
			} else {
				$query->orderBy($sortBy, $order);
			}
		} else {
			$query->latest();
		}

		return ProductResource::collection($query->paginate($perPage));
	}

	public function store(StoreProductRequest $request)
	{
		$product = $this->productService->create(array_merge([
			'reviews' => 0,
			'is_availability' => true,
		], $request->validated()));

		return (new ProductResource($product))->response()->setStatusCode(201);
	}

	public function show(Product $product)
	{
		return new ProductResource($product);
	}

	public function update(UpdateProductRequest $request, Product $product)
	{
		$product = $this->productService->update($product, $request->validated());

		return new ProductResource($product);
	}

	public function destroy(Product $product): JsonResponse
	{
		$this->productService->delete($product);

		return response()->json([
			'message' => 'Product deleted successfully',
		]);
	}
}