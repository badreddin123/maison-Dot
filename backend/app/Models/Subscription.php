<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_name',
        'plan_type',
        'price',
        'currency',
        'billing_cycle',
        'status',
        'start_date',
        'end_date',
        'features',
        'max_properties',
        'max_bookings',
        'commission_rate',
        'stripe_subscription_id',
        'stripe_customer_id',
        'trial_ends_at',
        'cancelled_at',
        'metadata'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'trial_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'features' => 'array',
        'metadata' => 'array',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now());
    }

    public function scopeTrialing($query)
    {
        return $query->where('status', 'trialing')
                    ->where('trial_ends_at', '>', now());
    }

    // Accessors & Mutators
    public function getIsActiveAttribute()
    {
        return $this->status === 'active' && 
               ($this->end_date === null || $this->end_date->isFuture());
    }

    public function getIsExpiredAttribute()
    {
        return $this->end_date && $this->end_date->isPast();
    }

    public function getIsTrialingAttribute()
    {
        return $this->status === 'trialing' && 
               $this->trial_ends_at && 
               $this->trial_ends_at->isFuture();
    }

    public function getDaysRemainingAttribute()
    {
        if (!$this->end_date) {
            return null;
        }
        
        return max(0, now()->diffInDays($this->end_date, false));
    }

    // Methods
    public function cancel()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now()
        ]);
    }

    public function renew($endDate = null)
    {
        $this->update([
            'status' => 'active',
            'end_date' => $endDate ?? now()->addMonth(),
            'cancelled_at' => null
        ]);
    }

    public function hasFeature($feature)
    {
        return in_array($feature, $this->features ?? []);
    }

    public function canAddProperty()
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->max_properties === null) {
            return true; // Unlimited
        }

        $currentCount = $this->user->properties()->count();
        return $currentCount < $this->max_properties;
    }

    public function canAddBooking()
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->max_bookings === null) {
            return true; // Unlimited
        }

        $currentCount = $this->user->bookings()->count();
        return $currentCount < $this->max_bookings;
    }
}
