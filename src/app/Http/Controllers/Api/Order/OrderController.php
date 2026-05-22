<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
	public function index(Request $request)
	{
		$perPage = max(1, min(100, (int) $request->integer('per_page', 20)));

		$orders = $request->user()
			->orders()
			->withCount('items')
			->latest('created_at')
			->paginate($perPage);

		return OrderResource::collection($orders);
	}

	public function show(Request $request, Order $order)
	{
		abort_unless((int) $order->user_id === (int) $request->user()->id, 403);

		$order->loadMissing(['items.product', 'user']);

		return new OrderResource($order);
	}
}