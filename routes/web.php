<?php

use App\Http\Controllers\NotificationController;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/get-notifications', [NotificationController::class, 'getCurrentUserNotifications'])->name('getCurrentUserNotification');
    Route::post('/mark-notification-as-read/{id}', [NotificationController::class, 'markAsRead'])->name('markNotificationAsRead');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/space.php';
require __DIR__ . '/item.php';
