<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Notification;
use Auth;

class NotificationService
{
    public static function sendNotification(string $type = NotificationType::SUCCESS, int $receiver_id, ?int $sender_id)
    {

    }

    public static function sendSystemNotification(string $title, string $message, int $receiver_id)
    {
        try {
            return Notification::create([
                "title" => $title,
                "message" => $message,
                "type" => NotificationType::SYSTEM,
                "receiver_id" => $receiver_id
            ]);
        } catch (\Exception $e) {
            return $e;
        }
    }

    public static function getCurrentUserNotification()
    {
        try {
            $user = Auth::user();

            return Notification::where('receiver_id', $user->id)->where('is_read', false)->get();
        } catch (\Exception $e) {
            return $e;
        }
    }

    public static function markNotificationAsRead(int $notification_id)
    {
        try {
            $notification = Notification::findOrFail($notification_id);
            $notification->is_read = true;
            $notification->read_at = now();
            return $notification->save();
        } catch (\Exception $e) {
            return $e;
        }
    }
}