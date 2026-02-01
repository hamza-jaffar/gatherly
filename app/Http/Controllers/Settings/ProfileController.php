<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\ActivityLog;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $oldValues = $user->getAttributes();

        // Update basic profile fields
        $user->fill($request->validated());

        // Handle profile picture upload
        if ($request->hasFile('avatar')) {
            $user->avatar = FileHelper::replace(
                $user->avatar,
                $request->file('avatar'),
                'avatars'
            );
        }

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $changes = $user->getChanges();

        if (! empty($changes)) {
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'update',
                'resource_type' => 'profile',
                'resource_id' => $user->id,
                'old_values' => array_intersect_key($oldValues, $changes),
                'new_values' => $changes,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return to_route('profile.edit')
            ->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'deleted',
            'resource_type' => 'user',
            'resource_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
