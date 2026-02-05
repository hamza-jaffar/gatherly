<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Item;
use App\Models\Space;
use App\Services\ItemService;
use App\Services\SpaceMemberService;
use App\Services\TaskAssignmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ItemController extends Controller
{
    protected $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

    /**
     * Display a listing of the items.
     */
    public function index(Space $space, Request $request)
    {
        $items = $this->itemService->listItems($space, $request->only(['type', 'status']));

        $items->getCollection()->transform(function ($item) use ($request) {
            $item->can = [
                'update' => $request->user() ? $request->user()->can('update', $item) : false,
                'delete' => $request->user() ? $request->user()->can('delete', $item) : false,
            ];

            return $item;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'items' => $items,
                'filters' => $request->only(['type', 'status']),
            ]);
        }

        return Inertia::render('spaces/items/index', [
            'space' => $space->load('owner'),
            'items' => $items,
            'filters' => $request->only(['type', 'status']),
            'can' => [
                'createItem' => $request->user() ? $request->user()->can('create', [Item::class, $space]) : false,
            ],
        ]);
    }

    /**
     * Search space members for @mention autocomplete
     */
    public function searchMembers(Space $space, Request $request)
    {
        try {
            $query = $request->input('q', '');
            
            if (strlen($query) < 1) {
                return response()->json([]);
            }

            $members = SpaceMemberService::searchMembers($space, $query);

            return response()->json($members);
        } catch (\Exception $e) {
            Log::error('Failed to search members: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to search members'], 500);
        }
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Space $space, StoreItemRequest $request)
    {
        $this->authorize('create', [Item::class, $space]);
        $item = $this->itemService->createItem($space, $request->validated());

        // Sync mentioned users to task_assignments
        if ($item->type === 'TASK' && $request->has('mentioned_users') && !empty($request->mentioned_users)) {
            TaskAssignmentService::syncAssignments($item, $request->mentioned_users, auth()->id());
        }

        Log::info("Item created: {$item->id} in space {$space->id} by user ".auth()->id());

        return back()->with('success', 'Item created successfully.');
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Space $space, Item $item, UpdateItemRequest $request)
    {
        if ($item->space_id !== $space->id) {
            abort(403);
        }

        $this->authorize('update', $item);

        $this->itemService->updateItem($item, $request->validated());

        // Sync mentioned users to task_assignments
        if ($item->type === 'TASK' && $request->has('mentioned_users')) {
            TaskAssignmentService::syncAssignments($item, $request->mentioned_users ?? [], auth()->id());
        }

        Log::info("Item updated: {$item->id} by user ".auth()->id());

        return back()->with('success', 'Item updated successfully.');
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(Space $space, Item $item)
    {
        if ($item->space_id !== $space->id) {
            abort(403);
        }

        $this->authorize('delete', $item);

        $this->itemService->deleteItem($item);

        Log::info("Item deleted: {$item->id} by user ".auth()->id());

        return back()->with('success', 'Item deleted successfully.');
    }
}
