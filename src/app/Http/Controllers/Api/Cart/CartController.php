<?php

namespace App\Http\Controllers\Api\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductCart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::with('items.product')->firstOrCreate(
            ['user_id' => $user->id],
            ['id' => (string) Str::uuid()]
        );

        return response()->json([
            'data' => CartItemResource::collection($cart->items),
        ]);
    }

    public function store(StoreCartItemRequest $request): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['id' => (string) Str::uuid()]
        );

        $product = Product::findOrFail($request->product_id);

        $item = ProductCart::firstOrNew([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        $item->amount = max(1, ($item->exists ? $item->amount : 0) + $request->amount);
        $item->save();
        $item->load('product');

        return response()->json(new CartItemResource($item), 201);
    }

    public function update(UpdateCartItemRequest $request, Product $product): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->firstOrFail();

        $item = ProductCart::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->firstOrFail();

        $item->amount = $request->amount;
        $item->save();
        $item->load('product');

        return response()->json(new CartItemResource($item));
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->firstOrFail();

        $item = ProductCart::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->firstOrFail();

        $item->delete();

        return response()->json(null, 204);
    }
}
