<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Item;
use App\Models\Space;
use App\Services\ItemService;
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
     * Store a newly created item in storage.
     */
    public function store(Space $space, StoreItemRequest $request)
    {
        $this->authorize('create', [Item::class, $space]);
        $item = $this->itemService->createItem($space, $request->validated());

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
