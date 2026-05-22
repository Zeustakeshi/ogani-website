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
	private const SIZE_WEIGHT_RULES = [
		'large' => ['min' => 5, 'max' => null],
		'medium' => ['min' => 3, 'max' => 5],
		'small' => ['min' => 1, 'max' => 3],
		'tiny' => ['min' => null, 'max' => 1],
	];

	public function __construct(private ProductService $productService)
	{
	}

	public function index(Request $request)
	{
		$perPage = max(1, (int) $request->integer('per_page', $request->integer('limit', 12)));
		$categoryId = $request->query('category_id');
		$search = $request->query('search');
		$minPrice = $request->query('min_price');
		$maxPrice = $request->query('max_price');
		$minWeight = $request->query('min_weight');
		$maxWeight = $request->query('max_weight');
		$size = $request->query('size');
		$sortBy = $request->query('sort_by', $request->query('sort'));
		$order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

		if ($sortBy && str_contains($sortBy, '_')) {
			[$sortField, $sortDirection] = array_pad(explode('_', $sortBy, 2), 2, null);
			if ($sortField) {
				$sortBy = $sortField;
			}
			if (in_array($sortDirection, ['asc', 'desc'], true)) {
				$order = $sortDirection;
			}
		}

		$query = Product::query();

		if ($categoryId) {
			$query->where('category_id', $categoryId);
		}

		if ($search) {
			$query->where(function ($builder) use ($search): void {
				$builder->where('name', 'like', "%{$search}%")
					->orWhere('description', 'like', "%{$search}%");
			});
		}

		if ($minPrice !== null && $minPrice !== '') {
			$query->where('price', '>=', (int) $minPrice);
		}

		if ($maxPrice !== null && $maxPrice !== '') {
			$query->where('price', '<=', (int) $maxPrice);
		}

		if ($minWeight !== null && $minWeight !== '') {
			$query->where('weight', '>=', (float) $minWeight);
		}

		if ($maxWeight !== null && $maxWeight !== '') {
			$query->where('weight', '<=', (float) $maxWeight);
		}

		if ($size) {
			$selectedSizes = array_values(array_filter(array_map(
				static fn (string $value): string => strtolower(trim($value)),
				explode(',', $size),
			)));

			if ($selectedSizes !== []) {
				$mins = array_map(
					static fn (string $selectedSize): float => self::SIZE_WEIGHT_RULES[$selectedSize]['min'] ?? 0,
					$selectedSizes,
				);
				$maxs = array_map(
					static fn (string $selectedSize): float => self::SIZE_WEIGHT_RULES[$selectedSize]['max'] ?? INF,
					$selectedSizes,
				);

				$overallMin = min($mins);
				$overallMax = max($maxs);

				if ($overallMin !== null) {
					$query->where('weight', '>=', $overallMin);
				}

				if ($overallMax !== INF) {
					$query->where('weight', '<=', $overallMax);
				}
			}
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
			} elseif ($sortBy === 'price') {
				$query->orderBy('price', $order);
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
			'inventory' => 0,
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