<?php

use App\Http\Controllers\Space\SpaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('spaces', SpaceController::class)->names('space');
});
