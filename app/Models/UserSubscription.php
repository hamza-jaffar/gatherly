<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'max_spaces',
        'max_members_per_space',
        'max_tasks_per_space',
        'storage_limit_mb',
        'features',
        'status',
        'started_at',
        'expires_at',
    ];

    protected $casts = [
        'features' => 'array',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
