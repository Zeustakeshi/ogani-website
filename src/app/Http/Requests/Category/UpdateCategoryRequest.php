<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
			'name' => ['sometimes', 'string', 'max:255', 'unique:categories,name,' . $this->category->id . ',id'],
			'description' => ['sometimes', 'string'],
		];
	}
}
