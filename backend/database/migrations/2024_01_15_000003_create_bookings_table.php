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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->integer('guests')->default(1);
            $table->text('special_requests')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            
            $table->index(['property_id', 'status']);
            $table->index(['client_id']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
