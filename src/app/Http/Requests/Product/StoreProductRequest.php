<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
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
			'name' => ['required', 'string', 'max:255'],
			'reviews' => ['sometimes', 'integer', 'min:0'],
			'price' => ['required', 'integer', 'min:0'],
			'description' => ['required', 'string'],
			'is_availability' => ['sometimes', 'boolean'],
			'weight' => ['required', 'numeric', 'min:0'],
			'images' => ['required', 'array', 'min:1'],
			'images.*' => ['required', 'string', 'max:2048'],
		];
	}
}