<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class AssignFreePlan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:assign-free-plan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign the Free plan to all users who do not have a subscription';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting assignment of Free plan to existing users...');

        $count = 0;

        User::doesntHave('subscription')->chunk(100, function ($users) use (&$count) {
            foreach ($users as $user) {
                try {
                    SubscriptionService::assignFreePlan($user);
                    $count++;
                    $this->line("Assigned Free plan to user: {$user->email}");
                } catch (\Exception $e) {
                    $this->error("Failed to assign plan to user {$user->id}: {$e->getMessage()}");
                }
            }
        });

        $this->info("Completed! Assigned Free plan to {$count} users.");
    }
}
