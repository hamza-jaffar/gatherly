<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpaceVisit extends Model
{
    protected $fillable = [
        'user_id',
        'visitor_id',
        'space_id',
        'first_seen_at',
        'last_seen_at',
        'visit_count',
        'ip_address',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
