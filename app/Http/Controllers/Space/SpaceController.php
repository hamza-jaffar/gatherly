<?php

namespace App\Http\Controllers\Space;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSpaceRequest;
use App\Http\Requests\UpdateSpaceRequest;
use App\Models\Space;
use App\Services\SpaceService;
use App\Services\SpaceVisitorService;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SpaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $spaces = SpaceService::index($request->all());

        if ($request->wantsJson()) {
            return response()->json($spaces);
        }

        return Inertia::render('spaces/index', [
            'spaces' => $spaces,
            'filters' => $request->only(['search', 'sort_by', 'sort_dir']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('spaces/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSpaceRequest $request)
    {
        try {
            SpaceService::create($request->validated(), $request->user()->id);

            return to_route('space.index')
                ->with('success', 'Space created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create space: '.$e->getMessage());

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Space $space, Request $request)
    {
        try {
            $space->load('owner', 'visits');
            
            $items = \App\Models\Item::where('space_id', $space->id)
                ->where(function ($query) {
                    $query->where('type', 'NOTE')
                          ->orWhere(function ($q) {
                              $q->where('type', 'TASK')
                                ->where('status', '!=', 'DONE');
                          });
                })
                ->latest()
                ->limit(7)
                ->get();
            
            SpaceVisitorService::track($space, $request->vid);

            return Inertia::render('spaces/show', [
                'space' => $space,
                'items' => $items,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to track space visitor: '.$e->getMessage());

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Space $space)
    {
        return Inertia::render('spaces/edit', [
            'space' => $space,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSpaceRequest $request, Space $space)
    {
        try {

            $user = Auth::user();

            SpaceService::edit($space, $request->validated(), $user->id);

            return to_route('space.index')
                ->with('success', 'Space updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update space: '.$e->getMessage());

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Space $space)
    {
        try {

            $user = Auth::user();

            SpaceService::delete($space->slug, $user->id);

            return to_route('space.index')
                ->with('success', 'Space deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete space: '.$e->getMessage());

            return back()->with('error', $e->getMessage());
        }
    }
}
