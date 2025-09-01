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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 10, 2); // montant HT
            $table->decimal('tax_amount', 10, 2)->default(0); // montant de la taxe
            $table->decimal('total_amount', 10, 2); // montant TTC
            $table->enum('status', ['pending', 'paid', 'overdue', 'cancelled'])->default('pending');
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();
            $table->timestamps();
            
            $table->index(['booking_id']);
            $table->index(['status']);
            $table->index(['due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
