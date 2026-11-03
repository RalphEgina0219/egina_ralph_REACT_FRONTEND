<?php 
 
namespace Database\Factories; 
 
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory; 
use Illuminate\Support\Str; 
 
/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory 
{ 
    public function definition(): array 
    { 
        $name = $this->faker->unique()->words(2, true);
 
        return [ 
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 50, 5000),
            'quantity' => $this->faker->numberBetween(1, 100),
        ]; 
    } 
} 