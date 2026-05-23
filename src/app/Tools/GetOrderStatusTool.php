<?php

namespace App\Tools;

use App\Models\Order;
use Prism\Prism\Tool;
use App\Models\User;

class GetOrderStatusTool
{
    public function toPrismTool(): Tool
    {
        return (new Tool())
            ->as('get_order_status')
            ->for('Lấy trạng thái đơn hàng của khách hàng theo mã đơn, username, email, điện thoại hoặc user id')
            ->withStringParameter('query', 'Mã đơn, username, email/số điện thoại, hoặc user:{id}')
            ->using(function (string $query): string {
                $q = trim($query);

                // user:<id> lookup
                if (preg_match('/^user:(\d+)$/', $q, $m)) {
                    $userId = (int) $m[1];
                    $orders = Order::query()->where('user_id', $userId)->orderBy('created_at', 'desc')->limit(5)->get();

                    if ($orders->isEmpty()) {
                        return "Không tìm thấy đơn hàng cho user id {$userId}.";
                    }

                    $lines = [];
                    foreach ($orders as $order) {
                        $lines[] = sprintf('Đơn hàng #%d — %s — %s VNĐ', $order->id, $order->statusLabel(), number_format((float) $order->total, 0, ',', '.'));
                    }

                    return "Đơn hàng cho user {$userId}: \n" . implode("\n", $lines);
                }

                // order id lookup
                if (is_numeric($q)) {
                    $order = Order::query()->find($q);

                    if (! $order) {
                        return "Không tìm thấy đơn hàng #{$q}";
                    }

                    return sprintf('Đơn hàng #%s: %s. Tổng tiền: %s VNĐ.', $order->id, $order->statusLabel(), number_format((float) $order->total, 0, ',', '.'));
                }

                // treat as username, email or phone -> find user first
                $user = User::query()
                    ->where(function ($query) use ($q): void {
                        $query
                            ->where('username', $q)
                            ->orWhere('email', $q)
                            ->orWhere('phone', $q);
                    })
                    ->first();

                if (! $user) {
                    return "Không tìm thấy đơn hàng bằng truy vấn: {$q}";
                }

                $orders = $user->orders()->orderBy('created_at', 'desc')->limit(5)->get();

                if ($orders->isEmpty()) {
                    return "Không tìm thấy đơn hàng cho tài khoản ({$q}).";
                }

                $lines = [];
                foreach ($orders as $order) {
                    $lines[] = sprintf('Đơn hàng #%d — %s — %s VNĐ', $order->id, $order->statusLabel(), number_format((float) $order->total, 0, ',', '.'));
                }

                return "Đơn hàng cho tài khoản ({$q}): \n" . implode("\n", $lines);
            });
    }
}