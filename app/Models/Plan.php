<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'max_spaces',
        'max_members_per_space',
        'max_tasks_per_space',
        'storage_limit_mb',
        'features',
        'price',
        'currency',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function subscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }
}
