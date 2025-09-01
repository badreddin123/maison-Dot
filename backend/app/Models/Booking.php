<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'client_id',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'guests',
        'special_requests',
        'cancellation_reason'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_price' => 'decimal:2'
    ];

    // Statuts des réservations
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_COMPLETED = 'completed';

    /**
     * Relation avec la propriété
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Relation avec le client
     */
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation avec les factures
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Obtenir le nombre de nuits
     */
    public function getNightsAttribute()
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    /**
     * Vérifier si la réservation peut être annulée
     */
    public function canBeCancelled()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]) 
               && $this->start_date->isFuture();
    }

    /**
     * Calculer le prix total
     */
    public function calculateTotalPrice()
    {
        if ($this->property) {
            $this->total_price = $this->property->getTotalPrice($this->start_date, $this->end_date);
            return $this->total_price;
        }
        return 0;
    }
}
