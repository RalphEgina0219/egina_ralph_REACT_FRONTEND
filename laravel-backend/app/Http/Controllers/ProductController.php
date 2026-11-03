<?php 
 
namespace App\Http\Controllers; 
 
use App\Models\Product; 
use Illuminate\Http\Request; 
use Illuminate\Support\Str; 
 
class ProductController extends Controller 
{ 
    // INDEX 
    public function index() 
    { 
        $products = Product::with('category')->get();
 
        $result = []; 
 
        foreach ($products as $product) { 
            $result[] = [ 
                'id' => $product->id, 
                'name' => $this->formatProductName($product->name), 
                'slug' => $product->slug, 
                'category' => $product->category?->name,
                'price' => $product->price, 
                'quantity' => $product->quantity, 
                'status' => $product->status, 
            ]; 
        } 
 
        return response()->json([ 
            'status' => true, 
            'message' => 'Products retrieved successfully.', 
            'data' => $result 
        ], 200);  
    } 
 
 
    // SHOW USING SLUG 
    public function show(string $slug) 
    { 
        $product = Product::where('slug', $slug)->first(); 
 
        if (!$product) { 
            return response()->json([ 
                'status' => false, 
                'message' => 'Product not found.' 
            ], 404); 
        } 
 
        return response()->json([ 
            'status' => true, 
            'message' => 'Product retrieved successfully.', 
            'data' => [ 
                'id' => $product->id, 
                'name' => $this->formatProductName($product->name), 
                'slug' => $product->slug, 
                'category' => $product->category?->name,
                'price' => $product->price, 
                'quantity' => $product->quantity, 
                'status' => $product->status, 
            ] 
        ], 200); 
    } 
 
 
     
    // USER-DEFINED FUNCTION 
    private function formatProductName($name) 
    { 
        return ucwords( 
            strtolower( 
                trim($name) 
            ) 
        ); 
    } 
}