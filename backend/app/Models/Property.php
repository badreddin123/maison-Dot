<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'price_per_night',
        'address',
        'latitude',
        'longitude',
        'bedrooms',
        'bathrooms',
        'area',
        'guests',
        'amenities',
        'images',
        'status',
        'featured',
        'manager_id'
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'price_per_night' => 'decimal:2',
        'featured' => 'boolean'
    ];

    // Types de propriétés
    const TYPE_HOUSE = 'house';
    const TYPE_APARTMENT = 'apartment';
    const TYPE_OFFICE = 'office';

    // Statuts
    const STATUS_AVAILABLE = 'available';
    const STATUS_OCCUPIED = 'occupied';
    const STATUS_MAINTENANCE = 'maintenance';

    /**
     * Relation avec le manager (propriétaire)
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Relation avec les réservations
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Vérifier si la propriété est disponible pour une période
     */
    public function isAvailableForPeriod($startDate, $endDate)
    {
        return !$this->bookings()
            ->where('status', Booking::STATUS_CONFIRMED)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                      });
            })->exists();
    }

    /**
     * Obtenir le prix total pour une période
     */
    public function getTotalPrice($startDate, $endDate)
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $days = $start->diff($end)->days;
        
        return $this->price_per_night * $days;
    }
}
