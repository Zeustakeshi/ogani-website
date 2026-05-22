<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFilteringTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_endpoint_filters_by_price_and_sort_alias(): void
    {
        $category = Category::factory()->create();

        $first = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'First product',
            'price' => 120000,
            'weight' => 2.5,
        ]);

        $second = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Second product',
            'price' => 180000,
            'weight' => 2.8,
        ]);

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Outside range',
            'price' => 250000,
            'weight' => 4.2,
        ]);

        $response = $this->getJson('/api/products?min_price=100000&max_price=200000&sort=price&order=asc');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.id', $first->id);
        $response->assertJsonPath('data.1.id', $second->id);
    }

    public function test_products_endpoint_sorts_by_rating_and_price_modes(): void
    {
        $category = Category::factory()->create();

        $lowRating = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Low rating',
            'price' => 120000,
            'rating' => 2,
            'reviews' => 10,
            'weight' => 2.0,
        ]);

        $highRating = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'High rating',
            'price' => 180000,
            'rating' => 5,
            'reviews' => 50,
            'weight' => 3.0,
        ]);

        $cheap = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Cheap product',
            'price' => 90000,
            'rating' => 3,
            'reviews' => 5,
            'weight' => 1.5,
        ]);

        $expensive = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Expensive product',
            'price' => 250000,
            'rating' => 4,
            'reviews' => 20,
            'weight' => 4.5,
        ]);

        $ratingResponse = $this->getJson('/api/products?sort=rating_desc');
        $ratingResponse->assertOk();
        $ratingResponse->assertJsonPath('data.0.id', $highRating->id);
        $ratingResponse->assertJsonPath('data.1.id', $expensive->id);

        $priceResponse = $this->getJson('/api/products?sort=price_asc');
        $priceResponse->assertOk();
        $priceResponse->assertJsonPath('data.0.id', $cheap->id);
        $priceResponse->assertJsonPath('data.1.id', $lowRating->id);
    }

    public function test_products_endpoint_filters_by_size_as_weight_range(): void
    {
        $category = Category::factory()->create();

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Tiny product',
            'price' => 90000,
            'weight' => 0.8,
        ]);

        $small = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Small product',
            'price' => 110000,
            'weight' => 2.0,
        ]);

        $medium = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Medium product',
            'price' => 140000,
            'weight' => 4.0,
        ]);

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Large product',
            'price' => 220000,
            'weight' => 6.2,
        ]);

        $response = $this->getJson('/api/products?size=small,medium');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonFragment(['id' => $small->id]);
        $response->assertJsonFragment(['id' => $medium->id]);
    }
}
