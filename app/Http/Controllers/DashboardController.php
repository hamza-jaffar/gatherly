<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {
        $user = Auth::user();
        $data = $this->dashboardService->getDashboardData($user);

        return Inertia::render('dashboard', $data);
    }
}
