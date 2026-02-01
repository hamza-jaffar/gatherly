<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\Request;

class UserActivityListener
{
    public function __construct(protected Request $request) {}

    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
            Registered::class => 'handleRegistered',
            PasswordReset::class => 'handlePasswordReset',
            Verified::class => 'handleVerified',
        ];
    }

    public function handleLogin(Login $event): void
    {
        $this->log($event->user, 'login', 'session');
    }

    public function handleLogout(Logout $event): void
    {
        if ($event->user) {
            $this->log($event->user, 'logout', 'session');
        }
    }

    public function handleRegistered(Registered $event): void
    {
        $this->log($event->user, 'created', 'user');
    }

    public function handlePasswordReset(PasswordReset $event): void
    {
        $this->log($event->user, 'password_reset', 'user');
    }

    public function handleVerified(Verified $event): void
    {
        $this->log($event->user, 'email_verified', 'user');
    }

    protected function log($user, string $action, string $resourceType, ?array $oldValues = null, ?array $newValues = null): void
    {
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $this->request->ip(),
            'user_agent' => $this->request->userAgent(),
        ]);
    }
}
