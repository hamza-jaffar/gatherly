<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::firstOrCreate(
            ['slug' => 'free'],
            [
                'name' => 'Free',
                'description' => 'The perfect starting point for small teams.',
                'max_spaces' => 3,
                'max_members_per_space' => 10,
                'max_tasks_per_space' => 100,
                'storage_limit_mb' => 500,
                'features' => [
                    'custom_fields' => false,
                    'analytics' => false,
                    'priority_tasks' => false,
                ],
                'price' => 0.00,
                'currency' => 'USD',
            ]
        );
    }
}
