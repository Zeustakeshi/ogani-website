<?php

namespace App\Http\Controllers\Api\Payment;

use App\Http\Controllers\Controller;
use App\Services\Payment\MomoService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Throwable;

class MomoController extends Controller
{
    public function __construct(private readonly MomoService $momoService)
    {
    }

    public function checkout(Request $request): JsonResponse
    {
        try {
            $result = $this->momoService->createCheckout($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Đã tạo yêu cầu thanh toán MoMo.',
                'data' => $result,
            ]);
        } catch (Throwable $throwable) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
            ], 400);
        }
    }

    public function callback(Request $request): JsonResponse
    {
        try {
            $result = $this->momoService->handleCallback($request->all());

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'order_id' => (string) $result['order']->id,
                    'status' => $result['order']->status,
                ],
            ]);
        } catch (InvalidArgumentException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        } catch (ModelNotFoundException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        } catch (Throwable $throwable) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
            ], 500);
        }
    }
}