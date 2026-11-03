<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SampleController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/variable-scope',[SampleController::class,'index']);
Route::get('/global-variable',[SampleController::class,'read']);
Route::get('/greet/{name}', [SampleController::class, 'greet']);

