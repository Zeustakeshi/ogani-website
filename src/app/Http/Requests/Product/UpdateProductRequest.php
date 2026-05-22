<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
			'name' => ['sometimes', 'string', 'max:255'],
			'reviews' => ['sometimes', 'integer', 'min:0'],
			'price' => ['sometimes', 'integer', 'min:0'],
			'description' => ['sometimes', 'string'],
			'is_availability' => ['sometimes', 'boolean'],
			'weight' => ['sometimes', 'numeric', 'min:0'],
			'images' => ['sometimes', 'array', 'min:1'],
			'images.*' => ['required_with:images', 'string', 'max:2048'],
		];
	}
}