<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
			'momo_order_id' => $this->momo_order_id,
			'coupon_code' => $this->coupon_code,
			'total' => $this->total,
			'address' => $this->address,
			'note' => $this->note,
			'status' => $this->status,
			'status_label' => method_exists($this->resource, 'statusLabel')
				? $this->resource->statusLabel()
				: ucfirst((string) $this->status),
			'paid_at' => $this->paid_at,
			'created_at' => $this->created_at,
			'items_count' => $this->whenCounted('items'),
			'items' => OrderItemResource::collection($this->whenLoaded('items')),
			'user' => $this->whenLoaded('user', function (): array {
				return [
					'id' => $this->user->id,
					'username' => $this->user->username,
					'email' => $this->user->email,
				];
			}),
		];
	}
}