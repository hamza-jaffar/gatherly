<?php

namespace App\Services;

use App\Models\ActivityLog;
use Auth;
use Illuminate\Http\Request;

class ActivitylogService
{
    public static function getActivitiesOfLoggedInUser(Request $request)
    {
        try {
            $user = Auth::user();
            
            $query = ActivityLog::where('user_id', $user->id);
            
            // Search functionality
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                      ->orWhere('resource_type', 'like', "%{$search}%")
                      ->orWhere('resource_id', 'like', "%{$search}%")
                      ->orWhere('ip_address', 'like', "%{$search}%");
                });
            }
            
            // Filter by resource type
            if ($request->filled('resource_type')) {
                $query->where('resource_type', $request->input('resource_type'));
            }
            
            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            
            // Validate sort column to prevent SQL injection
            $allowedColumns = ['action', 'resource_type', 'resource_id', 'ip_address', 'created_at'];
            if (!in_array($sortBy, $allowedColumns)) {
                $sortBy = 'created_at';
            }
            
            if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }
            
            $query->orderBy($sortBy, $sortOrder);
            
            // Pagination
            $perPage = $request->input('per_page', 10);
            $perPage = in_array($perPage, [10, 25, 50, 100]) ? $perPage : 10;
            
            return $query->paginate($perPage);

        } catch (\Exception $e) {
            return $e;
        }
    }
}