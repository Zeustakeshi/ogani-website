<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
			'description' => ['required', 'string'],
		];
	}
}
