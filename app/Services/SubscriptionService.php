<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\User;
use App\Models\UserSubscription;
use Carbon\Carbon;

class SubscriptionService
{
    /**
     * Assign the Free plan to a user.
     */
    public static function assignFreePlan(User $user): UserSubscription
    {
        $plan = Plan::where('slug', 'free')->firstOrFail();

        return UserSubscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'max_spaces' => $plan->max_spaces,
            'max_members_per_space' => $plan->max_members_per_space,
            'max_tasks_per_space' => $plan->max_tasks_per_space,
            'storage_limit_mb' => $plan->storage_limit_mb,
            'features' => $plan->features,
            'status' => 'active',
            'started_at' => Carbon::now(),
            'expires_at' => null, // Free plan doesn't expire
        ]);
    }

    /**
     * Check if a user can create more spaces.
     */
    public static function canCreateSpace(User $user): bool
    {
        $subscription = $user->subscription;

        if (!$subscription || $subscription->status !== 'active') {
            return false;
        }

        $currentSpaceCount = $user->ownedSpaces()->count();

        return $currentSpaceCount < $subscription->max_spaces;
    }

    /**
     * Get the current active subscription for a user.
     */
    public static function getActiveSubscription(User $user): ?UserSubscription
    {
        return $user->subscription()->where('status', 'active')->first();
    }
}
