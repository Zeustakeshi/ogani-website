<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
	protected $model = Product::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$imageIndexes = fake()->randomElements(range(1, 20), 2);

		return [
			'category_id' => Category::query()->inRandomOrder()->value('id') ?? Category::factory()->create()->id,
			'name' => fake()->words(3, true),
			'reviews' => fake()->numberBetween(0, 5000),
			'price' => fake()->numberBetween(50000, 500000),
			'description' => fake()->paragraphs(2, true),
			'is_availability' => fake()->boolean(85),
			'weight' => fake()->randomFloat(2, 0.2, 12),
			'inventory' => fake()->numberBetween(0, 300),
			'images' => array_map(
				fn (int $imageIndex): string => '/img/product/product-' . $imageIndex . '.jpg',
				$imageIndexes,
			),
		];
	}
}