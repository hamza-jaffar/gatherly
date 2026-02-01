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
            ->withTimestamps();
    }
}
