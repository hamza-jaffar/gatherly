<?php

namespace App\Services;

use App\Models\Space;
use App\Models\SpaceVisit;
use Auth;
use Illuminate\Support\Str;

class SpaceVisitorService
{
    /**
     * Track a visitor for a given space
     *
     * @param  string|null  $visitorId  Optional visitor UUID (for anonymous)
     */
    public static function track(Space $space, ?string $visitorId = null): SpaceVisit
    {
        $userId = Auth::id();

        if (! $userId && ! $visitorId) {
            $visitorId = (string) Str::uuid();
        }

        $visit = SpaceVisit::query()
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when($visitorId, fn ($q) => $q->where('visitor_id', $visitorId))
            ->where('space_id', $space->id)
            ->first();

        $now = now();

        // Use session key to prevent increment on refresh
        $sessionKey = 'space_visit_'.$space->id.'_'.($userId ?? $visitorId);
        $alreadyCounted = session()->get($sessionKey, false);

        if ($visit) {
            $visit->last_seen_at = $now;
            $visit->ip_address = request()->ip();
            $visit->user_agent = request()->userAgent();

            // Increment visit_count only if not counted in this session
            if (! $alreadyCounted) {
                $visit->visit_count += 1;
                session()->put($sessionKey, true);
            }

            $visit->save();
        } else {
            $visit = SpaceVisit::create([
                'user_id' => $userId,
                'visitor_id' => $visitorId,
                'space_id' => $space->id,
                'first_seen_at' => $now,
                'last_seen_at' => $now,
                'visit_count' => 1,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            session()->put($sessionKey, true);
        }

        return $visit;
    }
}
