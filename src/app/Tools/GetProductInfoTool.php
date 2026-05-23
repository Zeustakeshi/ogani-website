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
                    return "Không tìm thấy sản phẩm phù hợp với: {$normalizedQuery}";
                }

                $price = number_format((float) $product->price, 0, ',', '.');

                return sprintf(
                    'Sản phẩm: %s. Giá: %s VNĐ. Tồn kho: %d.',
                    $product->name,
                    $price,
                    (int) $product->inventory
                );
            });
    }
}