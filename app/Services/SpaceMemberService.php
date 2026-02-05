<?php

namespace App\Services;

use App\Models\Space;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SpaceMemberService
{
    public static function listMembers(Space $space, array $filters = [])
    {
        $search = $filters['search'] ?? null;

        return $space->users()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest('space_user.created_at')
            ->paginate(20);
    }

    public static function addMember(Space $space, string $email, string $role = 'member'): User
    {
        $user = User::where('email', $email)->firstOrFail();

        if ($space->users()->where('user_id', $user->id)->exists()) {
            throw new \RuntimeException('User is already a member of this space.');
        }

        $space->users()->attach($user->id, [
            'role' => $role,
            'joined_at' => now(),
        ]);

        return $user;
    }

    public static function updateMember(Space $space, int $userId, array $data)
    {
        return $space->users()->updateExistingPivot($userId, $data);
    }

    public static function removeMember(Space $space, int $userId)
    {
        return $space->users()->detach($userId);
    }

    /**
     * Search members for @mention autocomplete
     * Returns minimal user payload (id, name, email, avatar)
     */
    public static function searchMembers(Space $space, string $query)
    {
        return $space->users()
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                    ->orWhere('last_name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.email', 'users.avatar')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => trim("{$user->first_name} {$user->last_name}"),
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                ];
            });
    }
}
