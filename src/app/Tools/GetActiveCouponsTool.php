<?php

namespace App\Tools;

use App\Models\Coupon;
use Prism\Prism\Tool;

class GetActiveCouponsTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('get_active_coupons')
            ->for('Tra cứu coupon còn hạn theo mã hoặc lấy danh sách coupon đang hoạt động')
            ->withStringParameter('code', 'Mã coupon cụ thể (có thể bỏ trống)', false)
            ->withNumberParameter('limit', 'Số lượng coupon trả về khi không truyền code (1-10)', false)
            ->using(function (?string $code = null, ?float $limit = null): string {
                $normalizedCode = strtoupper(trim((string) $code));
                $normalizedLimit = max(1, min(10, (int) round($limit ?? 5)));

                if ($normalizedCode !== '') {
                    $coupon = Coupon::query()
                        ->whereRaw('LOWER(code) = ?', [strtolower($normalizedCode)])
                        ->where('expire_at', '>=', now())
                        ->first();

                    if (! $coupon) {
                        return "Coupon {$normalizedCode} không tồn tại hoặc đã hết hạn.";
                    }

                    return sprintf(
                        'Coupon %s: giảm %d%%, hết hạn lúc %s.',
                        (string) $coupon->code,
                        (int) $coupon->discount_percent,
                        optional($coupon->expire_at)->format('d/m/Y H:i') ?? 'không xác định'
                    );
                }

                $coupons = Coupon::query()
                    ->where('expire_at', '>=', now())
                    ->orderByDesc('discount_percent')
                    ->orderBy('expire_at')
                    ->limit($normalizedLimit)
                    ->get();

                if ($coupons->isEmpty()) {
                    return 'Hiện chưa có coupon nào đang hoạt động.';
                }

                $lines = [];
                foreach ($coupons as $coupon) {
                    $lines[] = sprintf(
                        '- %s | Giảm %d%% | Hết hạn: %s',
                        (string) $coupon->code,
                        (int) $coupon->discount_percent,
                        optional($coupon->expire_at)->format('d/m/Y H:i') ?? 'không xác định'
                    );
                }

                return "Coupon đang hoạt động:\n" . implode("\n", $lines);
            });
    }
}
