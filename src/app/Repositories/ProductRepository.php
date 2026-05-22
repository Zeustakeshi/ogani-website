<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository
{
	public function paginate(int $perPage = 12): LengthAwarePaginator
	{
		return Product::query()->latest()->paginate($perPage);
	}

	public function create(array $data): Product
	{
		return Product::query()->create($data);
	}

	public function update(Product $product, array $data): Product
	{
		$product->update($data);

		return $product->refresh();
	}

	public function delete(Product $product): void
	{
		$product->delete();
	}
}
