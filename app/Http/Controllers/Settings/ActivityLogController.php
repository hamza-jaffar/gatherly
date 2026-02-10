<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\ActivitylogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function get(Request $request)
    {
        try {

            $activityLogs = ActivitylogService::getActivitiesOfLoggedInUser($request);

            return Inertia::render('settings/activity-log', [
                'activities' => $activityLogs,
                'query_params' => $request->only(['search', 'resource_type', 'sort_by', 'sort_order', 'per_page'])
            ]);
        } catch (\Exception $e) {
            Log::error("Fail to get Activity Log: " . $e->getMessage());
            return back()->with('error', 'Fail to get Activity Log');
        }
    }
}
