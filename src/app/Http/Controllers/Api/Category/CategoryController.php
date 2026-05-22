<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
	public function index(Request $request)
	{
		$perPage = max(1, (int) $request->integer('per_page', 12));

		return CategoryResource::collection(Category::query()->paginate($perPage));
	}

	public function store(StoreCategoryRequest $request)
	{
		$category = Category::query()->create($request->validated());

		return (new CategoryResource($category))->response()->setStatusCode(201);
	}

	public function show(Category $category)
	{
		return new CategoryResource($category);
	}

	public function update(UpdateCategoryRequest $request, Category $category)
	{
		$category->update($request->validated());

		return new CategoryResource($category);
	}

	public function destroy(Category $category): JsonResponse
	{
		$category->delete();

		return response()->json([
			'message' => 'Category deleted successfully',
		]);
	}
}
