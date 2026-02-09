<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function getCurrentUserNotifications()
    {
        try {
            $notifications = NotificationService::getCurrentUserNotification();

            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            Log::get("Fail to get notification: " . $e->getMessage());
            return response()->json([
                'message' => "Fail to load notifications",
            ], 500);
        }
    }

    public function markAsRead(string $id)
    {
        try {
            NotificationService::markNotificationAsRead($id);
            return back()->with('success', 'Fail to mark notification as read');
        } catch (\Exception $e) {
            Log::error('Fail to Mark Notification as read ' . $e->getMessage());
            return back()->with('error', 'Fail to mark notification as read');
        }
    }
}
