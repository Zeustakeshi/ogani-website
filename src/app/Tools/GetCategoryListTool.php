<?php

namespace App\Tools;

use App\Models\Category;
use Prism\Prism\Tool;

class GetCategoryListTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('get_category_list')
            ->for('Lấy danh sách danh mục sản phẩm theo từ khóa')
            ->withStringParameter('query', 'Từ khóa danh mục (có thể bỏ trống)', false)
            ->withNumberParameter('limit', 'Số lượng danh mục trả về (1-20)', false)
            ->using(function (?string $query = null, ?float $limit = null): string {
                $keyword = trim((string) $query);
                $normalizedLimit = max(1, min(20, (int) round($limit ?? 10)));

                $categoriesQuery = Category::query()->withCount('products')->orderBy('name');

                if ($keyword !== '') {
                    $categoriesQuery->where(function ($builder) use ($keyword): void {
                        $builder
                            ->where('name', 'like', '%' . $keyword . '%')
                            ->orWhere('description', 'like', '%' . $keyword . '%');
                    });
                }

                $categories = $categoriesQuery->limit($normalizedLimit)->get();

                if ($categories->isEmpty()) {
                    return 'Không tìm thấy danh mục nào phù hợp.';
                }

                $lines = [];
                foreach ($categories as $category) {
                    $lines[] = sprintf(
                        '- %s | %d sản phẩm | ID: %s',
                        (string) $category->name,
                        (int) $category->products_count,
                        (string) $category->id,
                    );
                }

                return "Danh mục hiện có:\n" . implode("\n", $lines);
            });
    }
}
