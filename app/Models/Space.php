<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Space extends Model
{
    use SoftDeletes;

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_private',
        'created_by',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'space_user')
            ->withPivot('role', 'is_active', 'is_private')
            ->withTimestamps();
    }

    public function visits()
    {
        return $this->hasMany(SpaceVisit::class, 'space_id', 'id');
    }

    // Unique visitors (distinct by visitor_id)
    public function uniqueVisitors()
    {
        return $this->visits()
            ->select('visitor_id')
            ->distinct();
    }

    /**
     * Total visits (sum of visit_count)
     *
     * @return int
     */
    public function totalVisits()
    {
        return $this->visits()->sum('visit_count');
    }

    /**
     * Total unique visitors
     *
     * @return int
     */
    public function totalUniqueVisitors()
    {
        return $this->uniqueVisitors()->count();
    }
}
