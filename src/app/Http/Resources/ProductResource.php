<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'category_id' => $this->category_id,
			'name' => $this->name,
			'reviews' => $this->reviews,
			'rating' => $this->rating,
			'price' => $this->price,
			'description' => $this->description,
			'is_availability' => $this->is_availability,
			'weight' => $this->weight,
			'inventory' => $this->inventory ?? 0,
			'images' => $this->images ?? [],
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}