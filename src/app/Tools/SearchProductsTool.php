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
                    return 'Không tìm thấy sản phẩm phù hợp với điều kiện hiện tại.';
                }

                $lines = [];
                foreach ($products as $product) {
                    $lines[] = sprintf(
                        '- %s | %s VNĐ | Tồn kho: %d | Danh mục: %s | ID: %s',
                        $product->name,
                        number_format((float) $product->price, 0, ',', '.'),
                        (int) $product->inventory,
                        (string) optional($product->category)->name ?: 'Chưa phân loại',
                        (string) $product->id,
                    );
                }

                return "Danh sách sản phẩm gợi ý:\n" . implode("\n", $lines);
            });
    }
}
