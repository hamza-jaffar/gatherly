<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Item;
use App\Models\Notification;
use App\Models\Space;
use App\Models\SpaceVisit;
use App\Models\TaskAssignment;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData($user)
    {
        return [
            'stats' => $this->getStats($user),
            'recentActivities' => $this->getRecentActivities($user),
            'mostVisitedSpaces' => $this->getMostVisitedSpaces($user),
            'recentNotifications' => $this->getRecentNotifications($user),
            'taskStats' => $this->getTaskStats($user),
            'userSpaces' => $this->getUserSpaces($user),
            'itemStats' => $this->getItemStats($user),
        ];
    }

    private function getStats($user)
    {
        $totalSpaces = Space::where('spaces.created_by', $user->id)->count();
        $spaceIds = Space::where('spaces.created_by', $user->id)->pluck('spaces.id');
        $totalItems = Item::whereIn('space_id', $spaceIds)->count();
        $totalTasks = TaskAssignment::where('task_assignments.user_id', $user->id)->count();
        $completedTasks = TaskAssignment::where('task_assignments.user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        return [
            'total_spaces' => $totalSpaces,
            'total_items' => $totalItems,
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
        ];
    }

    private function getRecentActivities($user)
    {
        return ActivityLog::where('activity_logs.user_id', $user->id)
            ->select('id', 'action', 'resource_type', 'resource_id', 'created_at')
            ->latest('activity_logs.created_at')
            ->take(5)
            ->get();
    }

    private function getMostVisitedSpaces($user)
    {
        return SpaceVisit::select('space_id', DB::raw('SUM(visit_count) as total_visits'))
            ->where('space_visits.user_id', $user->id)
            ->where('space_visits.last_seen_at', '>=', now()->subDays(30))
            ->groupBy('space_id')
            ->orderByDesc('total_visits')
            ->take(5)
            ->with('space:id,name,slug')
            ->get(['space_id', 'total_visits']);
    }

    private function getRecentNotifications($user)
    {
        return Notification::where('notifications.receiver_id', $user->id)
            ->where('is_read', false)
            ->select('id', 'title', 'message', 'type', 'created_at')
            ->latest('notifications.created_at')
            ->take(5)
            ->get();
    }

    private function getTaskStats($user)
    {
        return [
            'pending' => TaskAssignment::where('task_assignments.user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'in_progress' => TaskAssignment::where('task_assignments.user_id', $user->id)
                ->where('status', 'in_progress')
                ->count(),
            'completed' => TaskAssignment::where('task_assignments.user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
        ];
    }

    private function getUserSpaces($user)
    {
        return Space::where('spaces.created_by', $user->id)
            ->select('spaces.id', 'spaces.name', 'spaces.slug', 'spaces.description', 'spaces.created_at')
            ->leftJoin('items', 'spaces.id', '=', 'items.space_id')
            ->groupBy('spaces.id', 'spaces.name', 'spaces.slug', 'spaces.description', 'spaces.created_at')
            ->selectRaw('COUNT(items.id) as items_count')
            ->take(6)
            ->get();
    }

    private function getItemStats($user)
    {
        $spaceIds = Space::where('spaces.created_by', $user->id)->pluck('spaces.id');
        
        return Item::whereIn('space_id', $spaceIds)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->toArray();
    }
}