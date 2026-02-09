<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Notification;

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
}