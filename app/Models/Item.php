<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'space_id',
        'created_by',
        'type',
        'title',
        'description',
        'status',
        'due_date',
    ];

    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignments()
    {
        return $this->hasMany(TaskAssignment::class);
    }

    public function assignees()
    {
        return $this->belongsToMany(User::class, 'task_assignments', 'task_id', 'user_id');
    }
}
