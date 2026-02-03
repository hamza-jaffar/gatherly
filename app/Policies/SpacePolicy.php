<?php

namespace App\Policies;

use App\Models\Space;
use App\Models\User;

class SpacePolicy
{
    /**
     * Determine whether the user can view the space.
     */
    public function view(User $user, Space $space): bool
    {
        if ($user->id === $space->created_by) {
            return true;
        }

        return $space->users()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create spaces.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create a space
    }

    /**
     * Determine whether the user can update the space.
     */
    public function update(User $user, Space $space): bool
    {
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (! $membership) {
            return false;
        }

        return in_array($membership->pivot->role, ['admin', 'editor']);
    }

    /**
     * Determine whether the user can delete the space.
     */
    public function delete(User $user, Space $space): bool
    {
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (! $membership) {
            return false;
        }

        return $membership->pivot->role === 'admin';
    }

    /**
     * Determine whether the user can manage members of the space.
     */
    public function manageMembers(User $user, Space $space): bool
    {
        if ($user->id === $space->created_by) {
            return true;
        }

        $membership = $space->users()->where('user_id', $user->id)->first();
        if (! $membership) {
            return false;
        }

        return $membership->pivot->role === 'admin';
    }
}
