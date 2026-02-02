<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('space_visits', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('visitor_id')->nullable();
            $table->foreignId('space_id')->constrained('spaces')->cascadeOnDelete();
            $table->dateTime('first_seen_at')->nullable();
            $table->dateTime('last_seen_at')->nullable();
            $table->integer('visit_count')->default(0);
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->index(['user_id', 'space_id']);
            $table->index(['visitor_id', 'space_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('space_visits');
    }
};
