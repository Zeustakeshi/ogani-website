<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCouponRequest extends FormRequest
{
	protected function prepareForValidation(): void
	{
		$normalized = [];

		if ($this->has('code')) {
			$normalized['code'] = strtoupper(trim((string) $this->input('code', '')));
		}

		if ($this->has('name')) {
			$normalized['name'] = trim((string) $this->input('name', ''));
		}

		if ($this->has('description')) {
			$normalized['description'] = trim((string) $this->input('description', ''));
		}

		if ($this->has('expire_at')) {
			$normalized['expire_at'] = trim((string) $this->input('expire_at', ''));
		}

		$this->merge($normalized);
	}

	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, array<int, string>>
	 */
	public function rules(): array
	{
		return [
			'code' => ['sometimes', 'string', 'max:255', 'unique:coupons,code,' . $this->coupon->id],
			'name' => ['sometimes', 'string', 'max:255'],
			'description' => ['sometimes', 'string'],
			'discount_percent' => ['sometimes', 'integer', 'min:0', 'max:100'],
			'expire_at' => ['sometimes', 'date'],
		];
	}
}