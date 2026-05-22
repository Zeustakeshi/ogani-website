<?php

namespace App\Services\Payment;

use App\Models\Cart;
use App\Models\Order;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class MomoService
{
    private const CREATE_SIGNATURE_FIELDS = [
        'accessKey',
        'amount',
        'extraData',
        'ipnUrl',
        'orderId',
        'orderInfo',
        'partnerCode',
        'redirectUrl',
        'requestId',
        'requestType',
    ];

    private const CALLBACK_SIGNATURE_FIELDS = [
        'accessKey',
        'amount',
        'extraData',
        'message',
        'orderId',
        'orderInfo',
        'orderType',
        'partnerCode',
        'payType',
        'requestId',
        'responseTime',
        'resultCode',
        'transId',
    ];

    public function createCheckout(User $user, array $input = []): array
    {
        $this->requireConfig('partner_code');
        $this->requireConfig('access_key');
        $this->requireConfig('secret_key');
        $this->requireConfig('endpoint');

        $cart = Cart::query()->with('items.product')->firstWhere('user_id', $user->id);

        if (! $cart || $cart->items->isEmpty()) {
            throw new RuntimeException('Giỏ hàng của bạn đang trống.');
        }

        $items = $cart->items
            ->filter(fn (ProductCart $item): bool => $item->amount > 0 && $item->product !== null)
            ->values();

        if ($items->isEmpty()) {
            throw new RuntimeException('Giỏ hàng của bạn đang trống.');
        }

        $total = (int) $items->sum(function (ProductCart $item): int {
            return $item->amount * (int) ($item->product?->price ?? 0);
        });

        if ($total <= 0) {
            throw new RuntimeException('Không thể tạo thanh toán cho giỏ hàng không hợp lệ.');
        }

        $address = trim((string) ($input['address'] ?? ''));
        $note = trim((string) ($input['note'] ?? ''));

        if ($address === '') {
            throw new InvalidArgumentException('Vui lòng nhập địa chỉ giao hàng.');
        }

        $order = DB::transaction(function () use ($user, $items, $total, $address, $note): Order {
            $order = Order::query()->create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => $total,
                'address' => $address,
                'note' => $note !== '' ? $note : null,
                'created_at' => now(),
            ]);

            $order->forceFill([
                'momo_order_id' => sprintf('OGANI-%s-%s', $order->id, Str::upper(Str::uuid()->toString())),
            ])->save();

            $order->items()->createMany(
                $items->map(function (ProductCart $item): array {
                    return [
                        'product_id' => $item->product_id,
                        'price' => (int) ($item->product?->price ?? 0),
                        'amount' => $item->amount,
                    ];
                })->all(),
            );

            return $order;
        });

        $payload = [
            'partnerCode' => $this->requireConfig('partner_code'),
            'accessKey' => $this->requireConfig('access_key'),
            'requestId' => (string) Str::uuid(),
            'amount' => (string) $order->total,
            'orderId' => (string) $order->momo_order_id,
            'orderInfo' => sprintf('Thanh toan don hang #%s', $order->id),
            'redirectUrl' => config('services.momo.return_url'),
            'ipnUrl' => config('services.momo.ipn_url'),
            'extraData' => '',
            'requestType' => config('services.momo.request_type', 'captureWallet'),
        ];

        $payload['signature'] = $this->signPayload($payload, self::CREATE_SIGNATURE_FIELDS);

        $response = Http::asJson()
            ->acceptJson()
            ->timeout(30)
            ->post($this->requireConfig('endpoint'), $payload)
            ->throw()
            ->json();

        $payUrl = $response['payUrl']
            ?? $response['deeplink']
            ?? $response['qrCodeUrl']
            ?? $response['url']
            ?? null;

        if (! $payUrl) {
            throw new RuntimeException($response['message'] ?? 'Không thể khởi tạo thanh toán MoMo.');
        }

        return [
            'orderId' => (string) $order->momo_order_id,
            'payUrl' => $payUrl,
            'momoResponse' => $response,
        ];
    }

    public function handleCallback(array $payload): array
    {
        $this->assertValidSignature($payload);

        $orderId = (string) ($payload['orderId'] ?? '');
        $orderQuery = Order::query();

        if (ctype_digit($orderId)) {
            $orderQuery->whereKey((int) $orderId);
        } else {
            $orderQuery->where('momo_order_id', $orderId);
        }

        $order = $orderQuery->first();

        if (! $order) {
            throw tap(new ModelNotFoundException(), function (ModelNotFoundException $exception) use ($orderId): void {
                $exception->setModel(Order::class, [$orderId]);
            });
        }

        if ($order->status === 'paid') {
            return [
                'message' => 'Đơn hàng đã được xử lý trước đó.',
                'order' => $order,
            ];
        }

        $resultCode = (int) ($payload['resultCode'] ?? 0);
        $message = (string) ($payload['message'] ?? '');

        if ($resultCode === 0) {
            $order->forceFill([
                'status' => 'paid',
                'momo_trans_id' => (string) ($payload['transId'] ?? ''),
                'paid_at' => now(),
            ])->save();

            $cart = Cart::query()->firstWhere('user_id', $order->user_id);
            if ($cart) {
                $cart->items()->delete();
            }

            return [
                'message' => $message !== '' ? $message : 'Thanh toán thành công.',
                'order' => $order,
            ];
        }

        $order->forceFill([
            'status' => 'failed',
        ])->save();

        return [
            'message' => $message !== '' ? $message : 'Thanh toán không thành công.',
            'order' => $order,
        ];
    }

    private function assertValidSignature(array $payload): void
    {
        $expectedSignature = $this->signPayload($payload, self::CALLBACK_SIGNATURE_FIELDS);
        $receivedSignature = strtolower((string) ($payload['signature'] ?? ''));

        if ($receivedSignature === '' || ! hash_equals($expectedSignature, $receivedSignature)) {
            throw new InvalidArgumentException('Invalid Signature');
        }
    }

    private function signPayload(array $payload, array $fields): string
    {
        $secretKey = $this->requireConfig('secret_key');
        $rawHash = implode('&', array_map(function (string $field) use ($payload): string {
            $value = $payload[$field] ?? $this->fallbackSignatureValue($field);

            return sprintf('%s=%s', $field, $value);
        }, $fields));

        return hash_hmac('sha256', $rawHash, $secretKey);
    }

    private function fallbackSignatureValue(string $field): string
    {
        return match ($field) {
            'accessKey' => $this->requireConfig('access_key'),
            default => '',
        };
    }

    private function requireConfig(string $key): string
    {
        $value = (string) config('services.momo.' . $key, '');

        if ($value === '') {
            throw new RuntimeException(sprintf('Thiếu cấu hình MoMo: %s', $key));
        }

        return $value;
    }
}