<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class StoreCouponRequest extends FormRequest
{
	protected function prepareForValidation(): void
	{
		$this->merge([
			'code' => strtoupper(trim((string) $this->input('code', ''))),
			'name' => trim((string) $this->input('name', '')),
			'description' => trim((string) $this->input('description', '')),
			'expire_at' => trim((string) $this->input('expire_at', '')),
		]);
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
			'code' => ['required', 'string', 'max:255', 'unique:coupons,code'],
			'name' => ['required', 'string', 'max:255'],
			'description' => ['required', 'string'],
			'discount_percent' => ['required', 'integer', 'min:0', 'max:100'],
			'expire_at' => ['required', 'date'],
		];
	}
}