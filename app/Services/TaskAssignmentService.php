<?php

namespace App\Services;

use App\Models\Item;
use App\Models\TaskAssignment;
use Illuminate\Support\Facades\DB;

class TaskAssignmentService
{
    /**
     * Assign multiple users to a task
     */
    public static function assignUsers(Item $item, array $userIds, int $assignedBy): void
    {
        $assignments = [];
        $now = now();

        foreach ($userIds as $userId) {
            // Check if assignment already exists
            $exists = TaskAssignment::where('task_id', $item->id)
                ->where('user_id', $userId)
                ->exists();

            if (!$exists) {
                $assignments[] = [
                    'task_id' => $item->id,
                    'user_id' => $userId,
                    'status' => 'pending',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (!empty($assignments)) {
            TaskAssignment::insert($assignments);
        }
    }

    /**
     * Sync assignments - add new ones, keep existing
     */
    public static function syncAssignments(Item $item, array $userIds, int $assignedBy): void
    {
        self::assignUsers($item, $userIds, $assignedBy);
    }

    /**
     * Get all assigned users for an item
     */
    public static function getAssignedUsers(Item $item)
    {
        return $item->assignees()->get();
    }

    /**
     * Remove a specific assignment
     */
    public static function removeAssignment(int $taskId, int $userId): bool
    {
        return TaskAssignment::where('task_id', $taskId)
            ->where('user_id', $userId)
            ->delete() > 0;
    }

    /**
     * Remove all assignments for a task
     */
    public static function clearAssignments(Item $item): void
    {
        TaskAssignment::where('task_id', $item->id)->delete();
    }

    /**
     * Update status for all task assignments of a specific task
     */
    public static function updateTaskAssignmentStatus(int $taskId, string $status): void
    {
        TaskAssignment::where('task_id', $taskId)->update([
            'status' => $status,
            'updated_at' => now(),
        ]);
    }
}
