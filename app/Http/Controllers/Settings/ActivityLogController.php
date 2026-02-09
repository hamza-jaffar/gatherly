<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function get(Request $request)
    {
        try {
            return Inertia::render('settings/activity-log');
        } catch (\Exception $e) {
            Log::error("Fail to get Activity Log: " . $e->getMessage());
            return back()->with('error', 'Fail to get Activity Log');
        }
    }
}
