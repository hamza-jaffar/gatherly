<?php

namespace App\Http\Controllers\Space;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSpaceRequest;
use App\Http\Requests\UpdateSpaceRequest;
use App\Models\Space;
use App\Services\SpaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $spaces = SpaceService::index($request->all());

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
        SpaceService::create($request->validated(), $request->user()->id);

        return to_route('space.index')
            ->with('success', 'Space created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Space $space)
    {
         $space->load('owner');

        return Inertia::render('spaces/show', [
            'space' => $space,
        ]);
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
        SpaceService::edit($space, $request->validated());

        return to_route('space.index')
            ->with('success', 'Space updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Space $space)
    {
        SpaceService::delete($space->slug);

        return to_route('space.index')
            ->with('success', 'Space deleted successfully.');
    }
}
