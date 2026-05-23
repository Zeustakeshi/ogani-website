<?php

namespace App\Tools;

use App\Services\Payment\MomoService;
use Illuminate\Contracts\Auth\Authenticatable;
use Laravel\Sanctum\PersonalAccessToken;
use Prism\Prism\Tool;

class CreateMomoCheckoutTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('create_momo_checkout')
            ->for('Tạo đơn hàng từ giỏ và trả về link thanh toán MoMo cho người dùng đã đăng nhập')
            ->withStringParameter('address', 'Địa chỉ giao hàng')
            ->withStringParameter('note', 'Ghi chú đơn hàng', false)
            ->withStringParameter('coupon_code', 'Mã giảm giá', false)
            ->using(function (string $address, ?string $note = null, ?string $coupon_code = null): string {
                $user = $this->resolveAuthenticatedUser();

                if (! $user) {
                    return json_encode([
                        'error' => 'Bạn cần đăng nhập trước khi đặt hàng qua chatbot.',
                    ], JSON_UNESCAPED_UNICODE);
                }

                try {
                    $checkout = app(MomoService::class)->createCheckout($user, [
                        'address' => $address,
                        'note' => (string) ($note ?? ''),
                        'coupon_code' => (string) ($coupon_code ?? ''),
                    ]);

                    return json_encode([
                        'summary' => 'Đã tạo đơn hàng. Bạn có thể nhấn nút thanh toán để hoàn tất qua MoMo.',
                        'checkout' => $checkout,
                    ], JSON_UNESCAPED_UNICODE);
                } catch (\Throwable $throwable) {
                    return json_encode([
                        'error' => $throwable->getMessage(),
                    ], JSON_UNESCAPED_UNICODE);
                }
            });
    }

    private function resolveAuthenticatedUser(): ?Authenticatable
    {
        $request = request();

        if (! $request) {
            return null;
        }

        $user = $request->user();

        if ($user) {
            return $user;
        }

        $token = $request->bearerToken() ?: $request->cookie('token');

        if (! $token) {
            return null;
        }

        $tokenModel = PersonalAccessToken::findToken($token);

        if (! $tokenModel) {
            return null;
        }

        $tokenable = $tokenModel->tokenable;

        return $tokenable instanceof Authenticatable ? $tokenable : null;
    }
}