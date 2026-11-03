<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ApiDataController;
use App\Http\Controllers\HumanResourceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\V1\ProductController as V1ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index'])->name('api.v1.categories.index');
Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('api.v1.categories.show');
Route::get('/users', [ApiDataController::class, 'users']);
Route::get('/orders', [ApiDataController::class, 'orders']);
Route::get('/order-products', [ApiDataController::class, 'orderProducts']);
Route::get('/addresses', [ApiDataController::class, 'addresses']);
Route::get('/reviews', [ApiDataController::class, 'reviews']);
Route::get('/products', [V1ProductController::class, 'index'])->name('products.index');
Route::get('/products/queries', [V1ProductController::class, 'queries'])->name('products.queries');
Route::get('/products/{product}', [V1ProductController::class, 'show'])->name('products.show');
Route::post('/payroll', [HumanResourceController::class, 'payroll']);
Route::post('/calculate', [HumanResourceController::class, 'calculate']);