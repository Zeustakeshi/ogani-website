<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
			'order_id' => $this->order_id,
			'product_id' => $this->product_id,
			'price' => $this->price,
			'amount' => $this->amount,
			'subtotal' => (int) $this->price * (int) $this->amount,
			'product' => $this->whenLoaded('product', function (): array {
				return [
					'id' => $this->product->id,
					'name' => $this->product->name,
					'price' => $this->product->price,
					'images' => $this->product->images ?? [],
				];
			}),
		];
	}
}