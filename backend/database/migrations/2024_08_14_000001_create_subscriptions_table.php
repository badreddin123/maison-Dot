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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan_name');
            $table->enum('plan_type', ['basic', 'premium', 'enterprise', 'custom'])->default('basic');
            $table->decimal('price', 8, 2);
            $table->string('currency', 3)->default('EUR');
            $table->enum('billing_cycle', ['monthly', 'yearly', 'one-time'])->default('monthly');
            $table->enum('status', ['active', 'inactive', 'cancelled', 'expired', 'trialing', 'pending'])->default('pending');
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->json('features')->nullable();
            $table->integer('max_properties')->nullable(); // null = unlimited
            $table->integer('max_bookings')->nullable(); // null = unlimited
            $table->decimal('commission_rate', 5, 2)->default(5.00); // percentage
            
            // Stripe integration fields
            $table->string('stripe_subscription_id')->nullable();
            $table->string('stripe_customer_id')->nullable();
            
            // Trial period
            $table->timestamp('trial_ends_at')->nullable();
            
            // Cancellation
            $table->timestamp('cancelled_at')->nullable();
            
            // Additional metadata
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('status');
            $table->index('end_date');
            $table->index('stripe_subscription_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
