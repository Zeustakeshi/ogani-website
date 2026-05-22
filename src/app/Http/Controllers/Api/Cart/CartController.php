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
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['id' => (string) Str::uuid()]
        );
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = max(1, min(50, $request->integer('per_page', 6)));
        $cart = $this->getOrCreateCart($request);
        $items = $cart->items()
            ->with('product')
            ->latest('created_at')
            ->paginate($perPage);

        return CartItemResource::collection($items);
    }

    public function summary(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request)->load('items.product');

        $itemCount = (int) $cart->items->sum('amount');
        $total = (int) $cart->items->sum(function (ProductCart $item): int {
            return $item->amount * (int) ($item->product?->price ?? 0);
        });

        return response()->json([
            'data' => [
                'item_count' => $itemCount,
                'total' => $total,
            ],
        ]);
    }

    public function store(StoreCartItemRequest $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);

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
        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();

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
        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();

        $item = ProductCart::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->firstOrFail();

        $item->delete();

        return response()->json(null, 204);
    }
}
