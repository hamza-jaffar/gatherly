<?php

namespace App\Http\Controllers\Space;

use App\Http\Controllers\Controller;
use App\Models\Space;
use App\Services\SpaceMemberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpaceMemberController extends Controller
{
    public function index(Space $space, Request $request)
    {
        $members = SpaceMemberService::listMembers($space, $request->all());

        if ($request->wantsJson()) {
            return response()->json($members);
        }

        return Inertia::render('spaces/members/index', [
            'space' => $space->load('owner'),
            'members' => $members,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Space $space, Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,editor,member,viewer',
        ]);

        try {
            SpaceMemberService::addMember($space, $request->email, $request->role);
            return back()->with('success', 'Member added successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(Space $space, int $userId, Request $request)
    {
        $request->validate([
            'role' => 'required|in:admin,editor,member,viewer',
        ]);

        SpaceMemberService::updateMember($space, $userId, $request->only('role'));

        return back()->with('success', 'Member role updated.');
    }

    public function destroy(Space $space, int $userId)
    {
        SpaceMemberService::removeMember($space, $userId);

        return back()->with('success', 'Member removed successfully.');
    }
}
