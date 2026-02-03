<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\Space;
use App\Models\User;

class ItemPolicy
{
    /**
     * Determine whether the user can view the item.
     */
    public function view(User $user, Item $item): bool
    {
        $space = $item->space;
        if ($user->id === $space->created_by) {
            return true;
        }

        return $space->users()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create items in the space.
     */
    public function create(User $user, Space $space): bool
    {
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (!$membership) {
            return false;
        }

        return in_array($membership->pivot->role, ['admin', 'editor']);
    }

    /**
     * Determine whether the user can update the item.
     */
    public function update(User $user, Item $item): bool
    {
        $space = $item->space;
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (!$membership) {
            return false;
        }

        return in_array($membership->pivot->role, ['admin', 'editor']);
    }

    /**
     * Determine whether the user can delete the item.
     */
    public function delete(User $user, Item $item): bool
    {
        $space = $item->space;
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (!$membership) {
            return false;
        }

        return $membership->pivot->role === 'admin';
    }
}
