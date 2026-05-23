<?php

namespace App\Tools;

use App\Models\Product;
use Prism\Prism\Tool;

class SearchProductsTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('search_products')
            ->for('Tìm danh sách sản phẩm theo từ khóa, danh mục và cách sắp xếp')
            ->withStringParameter('keyword', 'Từ khóa tên/mô tả sản phẩm', false)
            ->withStringParameter('category', 'ID hoặc tên danh mục sản phẩm', false)
            ->withStringParameter('sort', 'Sắp xếp: rating_desc, price_asc, price_desc, newest', false)
            ->withNumberParameter('limit', 'Số lượng sản phẩm trả về (1-10)', false)
            ->using(function (?string $keyword = null, ?string $category = null, ?string $sort = null, ?float $limit = null): string {
                $normalizedKeyword = trim((string) $keyword);
                $normalizedCategory = trim((string) $category);
                $normalizedSort = strtolower(trim((string) $sort));
                $normalizedLimit = max(1, min(10, (int) round($limit ?? 5)));

                $query = Product::query()
                    ->with('category')
                    ->where('is_availability', true);

                if ($normalizedKeyword !== '') {
                    $query->where(function ($builder) use ($normalizedKeyword): void {
                        $builder
                            ->where('name', 'like', '%' . $normalizedKeyword . '%')
                            ->orWhere('description', 'like', '%' . $normalizedKeyword . '%');
                    });
                }

                if ($normalizedCategory !== '') {
                    $query->where(function ($builder) use ($normalizedCategory): void {
                        $builder
                            ->where('category_id', $normalizedCategory)
                            ->orWhereHas('category', function ($categoryQuery) use ($normalizedCategory): void {
                                $categoryQuery->where('name', 'like', '%' . $normalizedCategory . '%');
                            });
                    });
                }

                switch ($normalizedSort) {
                    case 'price_asc':
                        $query->orderBy('price', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('price', 'desc');
                        break;
                    case 'newest':
                        $query->latest();
                        break;
                    case 'rating_desc':
                    default:
                        $query->orderByDesc('rating')->orderByDesc('reviews');
                        break;
                }

                $products = $query->limit($normalizedLimit)->get();

                if ($products->isEmpty()) {
                    return json_encode([
                        'summary' => 'Không tìm thấy sản phẩm phù hợp với điều kiện hiện tại.',
                        'products' => [],
                    ], JSON_UNESCAPED_UNICODE);
                }

                $normalizedProducts = $products->map(function (Product $product): array {
                    $image = data_get($product->images ?? [], '0') ?? '/img/product/product-1.jpg';

                    if (is_string($image) && $image !== '' && ! str_starts_with($image, '/') && ! preg_match('/^https?:\/\//', $image) && ! str_starts_with($image, 'data:')) {
                        $image = '/' . ltrim($image, '/');
                    }

                    return [
                        'id' => (string) $product->id,
                        'title' => (string) $product->name,
                        'price' => number_format((float) $product->price, 0, ',', '.') . 'đ',
                        'image' => is_string($image) && $image !== '' ? $image : '/img/product/product-1.jpg',
                        'link' => '/product/' . $product->id,
                        'onSale' => false,
                        'oldPrice' => null,
                    ];
                })->values()->all();

                return json_encode([
                    'summary' => 'Danh sách sản phẩm gợi ý:',
                    'products' => $normalizedProducts,
                ], JSON_UNESCAPED_UNICODE);
            });
    }
}
