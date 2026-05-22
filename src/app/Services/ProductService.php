<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
	public function __construct(private ProductRepository $productRepository)
	{
	}

	public function paginate(int $perPage = 12): LengthAwarePaginator
	{
		return $this->productRepository->paginate($perPage);
	}

	public function create(array $data): Product
	{
		return $this->productRepository->create($data);
	}

	public function update(Product $product, array $data): Product
	{
		return $this->productRepository->update($product, $data);
	}

	public function delete(Product $product): void
	{
		$this->productRepository->delete($product);
	}
}