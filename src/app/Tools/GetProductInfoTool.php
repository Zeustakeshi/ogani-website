<?php

namespace App\Tools;

use App\Models\Product;
use Prism\Prism\Tool;

class GetProductInfoTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('get_product_info')
            ->for('Lấy thông tin sản phẩm theo tên hoặc ID')
            ->withStringParameter('query', 'Từ khóa tìm kiếm sản phẩm')
            ->using(function (string $query): string {
                $normalizedQuery = trim($query);

                $product = Product::query()
                    ->where('name', 'like', '%' . $normalizedQuery . '%')
                    ->orWhere('id', $normalizedQuery)
                    ->orderBy('name')
                    ->first();

                if (! $product) {
                    return json_encode([
                        'summary' => "Không tìm thấy sản phẩm phù hợp với: {$normalizedQuery}",
                        'product' => null,
                    ], JSON_UNESCAPED_UNICODE);
                }

                $price = number_format((float) $product->price, 0, ',', '.');

                $image = data_get($product->images ?? [], '0') ?? '/img/product/product-1.jpg';

                if (is_string($image) && $image !== '' && ! str_starts_with($image, '/') && ! preg_match('/^https?:\/\//', $image) && ! str_starts_with($image, 'data:')) {
                    $image = '/' . ltrim($image, '/');
                }

                return json_encode([
                    'summary' => sprintf(
                        'Chi tiết sản phẩm %s: giá %sđ, tồn kho %d.',
                        $product->name,
                        $price,
                        (int) $product->inventory,
                    ),
                    'product' => [
                        'id' => (string) $product->id,
                        'title' => (string) $product->name,
                        'price' => $price . 'đ',
                        'image' => is_string($image) && $image !== '' ? $image : '/img/product/product-1.jpg',
                        'link' => '/product/' . $product->id,
                        'description' => (string) ($product->description ?? ''),
                        'inventory' => (int) $product->inventory,
                        'rating' => (float) $product->rating,
                        'reviews' => (int) $product->reviews,
                    ],
                ], JSON_UNESCAPED_UNICODE);
            });
    }
}