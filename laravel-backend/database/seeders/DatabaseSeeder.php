<?php 
 
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product; 
use App\Models\Review;
use Illuminate\Database\Seeder; 
use App\Models\User;
 
class DatabaseSeeder extends Seeder 
{ 
    public function run(): void 
    { 
      $categories = Category::factory(5)->create();
      $products = Product::factory(2000)->recycle($categories)->create();
      $users = User::factory(20)->create();

      $users->each(function (User $user): void {
        \App\Models\Address::factory(fake()->numberBetween(1, 2))->for($user)->create();
      });

      $orders = $users->flatMap(fn (User $user) =>
        Order::factory(fake()->numberBetween(0, 5))->for($user)->create()
      );

      $orders->each(function (Order $order) use ($products): void {
        $products->random(fake()->numberBetween(1, 4))->each(function (Product $product) use ($order): void {
          OrderProduct::factory()->for($order)->for($product)->create();
        });
      });

      $products->each(function (Product $product) use ($users): void {
        $users->random(fake()->numberBetween(0, min(8, $users->count())))->each(function (User $user) use ($product): void {
          Review::factory()->for($user)->for($product)->create();
        });
      });
    } 
} 