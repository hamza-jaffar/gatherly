<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Space;
use App\Models\ActivityLog;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ItemService
{
    /**
     * List items for a space with filters and cursor pagination.
     */
    public function listItems(Space $space, array $filters = []): CursorPaginator
    {
        $query = Item::where('space_id', $space->id)->with('owner');

        if (isset($filters['type']) && $filters['type'] !== 'ALL') {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['status']) && $filters['status'] !== 'ALL' && ($filters['type'] ?? '') === 'TASK') {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->cursorPaginate(15);
    }

    public static function getItems(string $space_id, $limit = 7)
    {
        return Item::where('space_id', $space_id)
            ->where(function ($query) {
                $query->where('type', 'NOTE')
                    ->orWhere(function ($query) {
                        $query->where('type', 'TASK')
                            ->where('status', '!=', 'DONE');
                    });
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Create a new item.
     */
    public function createItem(Space $space, array $data): Item
    {
        $data['space_id'] = $space->id;
        $data['created_by'] = Auth::id();

        // Handle status for TASK vs NOTE
        if ($data['type'] === 'NOTE') {
            $data['status'] = null;
        } else {
            $data['status'] = $data['status'] ?? 'TODO';
        }

        // Generate unique slug
        $data['slug'] = $this->generateUniqueSlug($data['title']);

        return DB::transaction(function () use ($data) {
            $item = Item::create($data);

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'created',
                'resource_type' => 'item',
                'resource_id' => $item->id,
                'new_values' => $item->toArray(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $item;
        });
    }

    /**
     * Update an existing item.
     */
    public function updateItem(Item $item, array $data): bool
    {
        // If title changed, update slug
        if (isset($data['title']) && $data['title'] !== $item->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title']);
        }

        return DB::transaction(function () use ($item, $data) {
            $oldValues = $item->toArray();

            $updated = $item->update($data);

            if ($updated) {
                ActivityLog::create([
                    'user_id' => Auth::id(),
                    'action' => 'updated',
                    'resource_type' => 'item',
                    'resource_id' => $item->id,
                    'old_values' => $oldValues,
                    'new_values' => $item->fresh()->toArray(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            }

            return $updated;
        });
    }

    /**
     * Delete an item.
     */
    public function deleteItem(Item $item): bool
    {
        return DB::transaction(function () use ($item) {
            $oldValues = $item->toArray();
            $deleted = $item->delete();

            if ($deleted) {
                ActivityLog::create([
                    'user_id' => Auth::id(),
                    'action' => 'deleted',
                    'resource_type' => 'item',
                    'resource_id' => $item->id,
                    'old_values' => $oldValues,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            }

            return $deleted;
        });
    }

    /**
     * Generate a unique slug for the item.
     */
    protected function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (Item::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$count++;
        }

        return $slug;
    }
}
