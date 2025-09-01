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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['house', 'apartment', 'office']);
            $table->decimal('price_per_night', 10, 2);
            $table->text('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->decimal('area', 8, 2)->nullable(); // en m²
            $table->json('amenities')->nullable(); // équipements
            $table->json('images')->nullable(); // urls des images
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['type', 'status']);
            $table->index(['manager_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
