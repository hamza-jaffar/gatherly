<?php

namespace App\Services;

use App\Helpers\SlugHelper;
use App\Models\ActivityLog;
use App\Models\Space;
use App\Models\User;
use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class SpaceService
{
    public static function index(array $filters = [])
    {
        $limit = (int) ($filters['limit'] ?? 10);
        $search = $filters['search'] ?? null;
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        $allowedSorts = ['name', 'created_at', 'is_private'];

        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        if (! in_array(strtolower($sortDir), ['asc', 'desc'])) {
            $sortDir = 'desc';
        }

        $user = Auth::user();

        return Space::query()
            ->with(['owner'])
            ->where('created_by', $user->id)
            ->when($search, function (Builder $query) use ($search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($limit)
            ->withQueryString();
    }

    public static function getById(string $id): Space
    {
        return Space::findOrFail($id)->load(['owner', 'visits', 'uniqueVisitors']);
    }

    public static function getBySlug(string $slug): Space
    {
        return Space::where('slug', $slug)->firstOrFail()->load(['owner', 'visits', 'uniqueVisitors']);
    }

    public static function create(array $data, int $userId): Space
    {
        $user = User::findOrFail($userId);

        if (! SubscriptionService::canCreateSpace($user)) {
            throw new \RuntimeException('You have reached the maximum number of spaces allowed for your plan.');
        }

        return DB::transaction(function () use ($data, $userId) {
            $slug = SlugHelper::create($data['name'], 'spaces');

            $space = Space::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'is_private' => (bool) ($data['is_private'] ?? false),
                'created_by' => $userId,
                'slug' => $slug,
            ]);

            ActivityLog::create([
                'user_id' => $userId,
                'action' => 'created',
                'resource_type' => 'space',
                'resource_id' => $space->id,
                'new_values' => $space->toArray(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $space;
        });
    }

    public static function edit(Space $space, array $data, int $userId): Space
    {
        return DB::transaction(function () use ($space, $data, $userId) {
            $oldValues = $space->toArray();

            $space->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'is_private' => (bool) ($data['is_private'] ?? false),
            ]);

            ActivityLog::create([
                'user_id' => $userId,
                'action' => 'updated',
                'resource_type' => 'space',
                'resource_id' => $space->id,
                'old_values' => $oldValues,
                'new_values' => $space->fresh()->toArray(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $space;
        });
    }

    public static function delete(string $slug, int $userId): void
    {
        $space = Space::where('slug', $slug)->first();

        if (! $space) {
            throw new \RuntimeException('Space not found.');
        }

        $space->delete();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'deleted',
            'resource_type' => 'space',
            'resource_id' => $space->id,
            'old_values' => $space->toArray(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public static function forceDelete(string $slug, int $userId): void
    {
        $space = Space::where('slug', $slug)->first();

        if (! $space) {
            throw new \RuntimeException('Space not found.');
        }

        $oldValues = $space->toArray();
        $space->forceDelete();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'force_deleted',
            'resource_type' => 'space',
            'resource_id' => $space->id,
            'old_values' => $oldValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
