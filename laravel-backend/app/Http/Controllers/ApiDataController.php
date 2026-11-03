<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class ApiDataController extends Controller
{
    public function users(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => User::all(),
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => Category::with('products')->get(),
        ]);
    }

    public function orders(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => Order::with(['user', 'products'])->get(),
        ]);
    }

    public function addresses(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => Address::with('user')->get(),
        ]);
    }

    public function reviews(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => Review::with(['user', 'product'])->get(),
        ]);
    }

    public function orderProducts(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => OrderProduct::with(['order', 'product'])->get(),
        ]);
    }
}
