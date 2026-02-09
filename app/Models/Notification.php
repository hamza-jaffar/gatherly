<?php

namespace App\Models;

use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'title',
        'message',
        'is_read',
        'read_at',
        'type',
        'receiver_id',
        'sender_id',
    ];

    protected $casts = [
        'type' => NotificationType::class,
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
