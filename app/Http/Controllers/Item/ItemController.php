<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Space $space, Request $request)
    {
        // This could be used for a separate items page or for partial reloads
        $query = Item::where('space_id', $space->id);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status') && $request->type === 'TASK') {
            $query->where('status', $request->status);
        }

        $items = $query->latest()->get();

        return Inertia::render('spaces/items/index', [
            'space' => $space->load('owner'),
            'items' => $items,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    public function store(Space $space, Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:TASK,NOTE',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required_if:type,TASK|in:TODO,IN_PROGRESS,REVIEW,DONE',
            'due_date' => 'nullable|date',
        ]);

        $item = Item::create([
            ...$validated,
            'space_id' => $space->id,
            'created_by' => Auth::id(),
            'status' => $request->type === 'TASK' ? ($request->status ?? 'TODO') : null,
        ]);

        Log::info("Item created: {$item->id} in space {$space->id} by user ".Auth::id());

        return back()->with('success', 'Item created successfully.');
    }

    public function update(Space $space, Item $item, Request $request)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:TODO,IN_PROGRESS,REVIEW,DONE',
            'due_date' => 'nullable|date',
        ]);

        if ($item->space_id !== $space->id) {
            abort(403);
        }

        $item->update($validated);

        Log::info("Item updated: {$item->id} by user ".Auth::id());

        return back()->with('success', 'Item updated successfully.');
    }

    public function destroy(Space $space, Item $item)
    {
        if ($item->space_id !== $space->id) {
            abort(403);
        }

        $item->delete();

        Log::info("Item deleted: {$item->id} by user ".Auth::id());

        return back()->with('success', 'Item deleted successfully.');
    }
}
