<?php

namespace App\Http\Controllers\Api\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Requests\Coupon\StoreCouponRequest;
use App\Http\Requests\Coupon\UpdateCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CouponController extends Controller
{
	public function index(Request $request)
	{
		$perPage = max(1, (int) $request->integer('per_page', 12));

		return CouponResource::collection(Coupon::query()->latest()->paginate($perPage));
	}

	public function store(StoreCouponRequest $request)
	{
		$validated = $request->validated();
		$validated['expire_at'] = Carbon::parse($validated['expire_at'])->endOfDay();

		$coupon = Coupon::query()->create($validated);

		return (new CouponResource($coupon))->response()->setStatusCode(201);
	}

	public function show(Coupon $coupon)
	{
		return new CouponResource($coupon);
	}

	public function update(UpdateCouponRequest $request, Coupon $coupon)
	{
		$validated = array_filter($request->validated(), static fn ($value): bool => $value !== null);

		if (array_key_exists('expire_at', $validated)) {
			$validated['expire_at'] = Carbon::parse($validated['expire_at'])->endOfDay();
		}

		$coupon->update($validated);

		return new CouponResource($coupon);
	}

	public function validateCoupon(Request $request): JsonResponse
	{
		$data = $request->validate([
			'code' => ['required', 'string', 'max:255'],
		]);

		$coupon = $this->resolveActiveCoupon((string) $data['code']);

		if (! $coupon) {
			return response()->json([
				'success' => false,
				'message' => 'Mã giảm giá không hợp lệ hoặc đã hết hạn.',
			], 422);
		}

		return response()->json([
			'success' => true,
			'message' => 'Mã giảm giá hợp lệ.',
			'data' => new CouponResource($coupon),
		]);
	}

	public function destroy(Coupon $coupon): JsonResponse
	{
		$coupon->delete();

		return response()->json([
			'message' => 'Coupon deleted successfully',
		]);
	}

	private function resolveActiveCoupon(string $code): ?Coupon
	{
		$normalizedCode = Str::upper(trim($code));

		return Coupon::query()
			->whereRaw('LOWER(code) = ?', [Str::lower($normalizedCode)])
			->where('expire_at', '>=', now())
			->first();
	}
}