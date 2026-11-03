<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponses;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $products = Product::with('category')->paginate(10);

        return $this->ok(
            'Products retrieved successfully',
            ProductResource::collection($products)
        );
    }

    public function show(Product $product)
    {
        $product->load('category');

        return $this->ok(
            'Product retrieved successfully',
            new ProductResource($product)
        );
    }

    public function queries()
    {
        $nameAndPrice = Product::select('name', 'price')->get();
        $productsWithCategory = Product::with('category')->get();
        $productsOrderedByPrice = Product::select('id', 'name')
            ->orderBy('price', 'asc')
            ->get();
        $firstFiveProducts = Product::limit(5)->get();
        $priceGreaterThanOrEqual = Product::where('price', '>=', 3)->get();
        $electronics = Product::whereHas('category', fn ($query) =>
            $query->where('name', 'Electronics')
        )->get();
        $totalPrice = Product::sum('price');
        $averagePrice = Product::avg('price');
        $highestPrice = Product::max('price');
        $lowestPrice = Product::min('price');
        $totalPricePerCategory = Product::join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(products.price) as total_price'))
            ->groupBy('categories.name')
            ->get();
        $averagePricePerCategory = Product::join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('AVG(products.price) as avg_price'))
            ->groupBy('categories.name')
            ->get();
        $lowestPricePerCategory = Product::join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('MIN(products.price) as min_price'))
            ->groupBy('categories.name')
            ->get();
        $averagePriceSorted = Product::join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('AVG(products.price) as avg_price'))
            ->groupBy('categories.name')
            ->orderBy('avg_price', 'asc')
            ->get();
        $electronicsAndBooks = Product::join('categories', 'products.category_id', '=', 'categories.id')
            ->whereIn('categories.name', ['Electronics', 'Books'])
            ->select('categories.name', DB::raw('AVG(products.price) as avg_price'))
            ->groupBy('categories.name')
            ->get();

        return $this->success('Query results retrieved successfully', [
            'name_and_price' => $nameAndPrice,
            'products_with_category' => $productsWithCategory,
            'products_ordered_by_price' => $productsOrderedByPrice,
            'first_five_products' => $firstFiveProducts,
            'price_greater_than_or_equal' => $priceGreaterThanOrEqual,
            'electronics' => $electronics,
            'total_price' => $totalPrice,
            'average_price' => $averagePrice,
            'highest_price' => $highestPrice,
            'lowest_price' => $lowestPrice,
            'total_price_per_category' => $totalPricePerCategory,
            'average_price_per_category' => $averagePricePerCategory,
            'lowest_price_per_category' => $lowestPricePerCategory,
            'average_price_sorted' => $averagePriceSorted,
            'electronics_and_books' => $electronicsAndBooks,
        ]);
    }
}
