<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
	public function index(Request $request)
	{
		$perPage = max(1, min(100, (int) $request->integer('per_page', 20)));

		$orders = Order::query()
			->with('user')
			->latest('created_at')
			->paginate($perPage);

		return OrderResource::collection($orders);
	}
}