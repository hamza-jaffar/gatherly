<?php

use App\Http\Controllers\Space\SpaceController;
use App\Http\Controllers\Space\SpaceMemberController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('spaces', SpaceController::class)->names('space')->except('show');
});

Route::prefix('/spaces/{space:slug}')->name('space.')->group(function () {
    Route::get('/', [SpaceController::class, 'show'])->name('show');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::resource('members', SpaceMemberController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });
});
