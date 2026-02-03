<?php

use App\Http\Controllers\Item\ItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('/spaces/{space}')->group(function () {
    Route::get('/items', [ItemController::class, 'index'])->name('item.index');
    Route::post('/items', [ItemController::class, 'store'])->name('item.store');
    Route::put('/items/{item}', [ItemController::class, 'update'])->name('item.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('item.destroy');
});
