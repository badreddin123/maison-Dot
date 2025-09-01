<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'phone',
        'address',
        'profile_picture',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Rôles disponibles
    const ROLE_CLIENT = 'client';
    const ROLE_MANAGER = 'manager';
    const ROLE_ADMIN = 'admin';

    // Statuts disponibles
    const STATUS_PENDING = 'pending';
    const STATUS_ACTIVE = 'active';
    const STATUS_SUSPENDED = 'suspended';

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Vérifier si l'utilisateur est actif
     */
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Vérifier si l'utilisateur est en attente
     */
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Relations avec les propriétés (pour les managers)
     */
    public function properties()
    {
        return $this->hasMany(Property::class, 'manager_id');
    }

    /**
     * Relations avec les réservations (pour les clients)
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'client_id');
    }

    /**
     * Relations avec les abonnements
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Obtenir l'abonnement actif de l'utilisateur
     */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->where('status', 'active');
    }

    /**
     * Vérifier si l'utilisateur a un abonnement actif
     */
    public function hasActiveSubscription()
    {
        return $this->activeSubscription()->exists();
    }

    /**
     * Obtenir le plan d'abonnement actuel
     */
    public function getCurrentPlan()
    {
        $subscription = $this->activeSubscription()->first();
        return $subscription ? $subscription->plan_type : 'basic';
    }
}
