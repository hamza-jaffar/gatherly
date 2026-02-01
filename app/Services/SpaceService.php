<?php

namespace App\Services;

use App\Helpers\SlugHelper;
use App\Models\Space;
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

        return Space::query()
            ->with(['owner'])
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
        return Space::findOrFail($id);
    }

    public static function getBySlug(string $slug): Space
    {
        return Space::where('slug', $slug)->firstOrFail();
    }

    public static function create(array $data, int $userId): Space
    {
        return DB::transaction(function () use ($data, $userId) {
            $slug = SlugHelper::create($data['name'], 'spaces');

            return Space::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'is_private' => (bool) ($data['is_private'] ?? false),
                'created_by' => $userId,
                'slug' => $slug,
            ]);
        });
    }

    public static function edit(Space $space, array $data): Space
    {
        return DB::transaction(function () use ($space, $data) {
            $space->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'is_private' => (bool) ($data['is_private'] ?? false),
            ]);

            return $space;
        });
    }


    public static function delete(string $slug): void
    {
        $space = Space::where('slug', $slug)->first();

        if (! $space) {
            throw new \RuntimeException('Space not found.');
        }

        $space->delete();
    }

    public static function forceDelete(string $slug): void
    {
        $space = Space::where('slug', $slug)->first();

        if (! $space) {
            throw new \RuntimeException('Space not found.');
        }

        $space->forceDelete();
    }
}

