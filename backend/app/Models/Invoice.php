<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'invoice_number',
        'amount',
        'tax_amount',
        'total_amount',
        'status',
        'due_date',
        'paid_at',
        'payment_method',
        'payment_reference'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime'
    ];

    // Statuts des factures
    const STATUS_PENDING = 'pending';
    const STATUS_PAID = 'paid';
    const STATUS_OVERDUE = 'overdue';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Relation avec la réservation
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Générer un numéro de facture unique
     */
    public static function generateInvoiceNumber()
    {
        $year = date('Y');
        $lastInvoice = self::where('invoice_number', 'like', "INV-{$year}-%")->orderBy('id', 'desc')->first();
        
        if ($lastInvoice) {
            $lastNumber = intval(substr($lastInvoice->invoice_number, -4));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return sprintf("INV-%s-%04d", $year, $newNumber);
    }

    /**
     * Marquer la facture comme payée
     */
    public function markAsPaid($paymentMethod = null, $paymentReference = null)
    {
        $this->status = self::STATUS_PAID;
        $this->paid_at = now();
        $this->payment_method = $paymentMethod;
        $this->payment_reference = $paymentReference;
        $this->save();
    }

    /**
     * Vérifier si la facture est en retard
     */
    public function isOverdue()
    {
        return $this->status === self::STATUS_PENDING && $this->due_date->isPast();
    }

    /**
     * Calculer le montant total avec taxes
     */
    public function calculateTotal($taxRate = 0.20)
    {
        $this->tax_amount = $this->amount * $taxRate;
        $this->total_amount = $this->amount + $this->tax_amount;
        return $this->total_amount;
    }
}
