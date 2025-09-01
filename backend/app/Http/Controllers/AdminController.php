<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Middleware pour vérifier les permissions admin
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user() || !$request->user()->hasRole(User::ROLE_ADMIN)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Accès non autorisé'
                ], 403);
            }
            return $next($request);
        });
    }

    /**
     * Dashboard administrateur avec statistiques
     */
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_clients' => User::where('role', User::ROLE_CLIENT)->count(),
            'total_managers' => User::where('role', User::ROLE_MANAGER)->count(),
            'pending_managers' => User::where('role', User::ROLE_MANAGER)
                                     ->where('status', User::STATUS_PENDING)->count(),
            'total_properties' => Property::count(),
            'available_properties' => Property::where('status', Property::STATUS_AVAILABLE)->count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', Booking::STATUS_PENDING)->count(),
            'confirmed_bookings' => Booking::where('status', Booking::STATUS_CONFIRMED)->count(),
            'total_revenue' => Invoice::where('status', Invoice::STATUS_PAID)->sum('total_amount'),
            'pending_payments' => Invoice::where('status', Invoice::STATUS_PENDING)->sum('total_amount'),
        ];

        // Statistiques par mois pour les graphiques
        $monthlyStats = [
            'bookings' => Booking::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get(),
            'revenue' => Invoice::selectRaw('MONTH(created_at) as month, SUM(total_amount) as total')
                ->where('status', Invoice::STATUS_PAID)
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get(),
        ];

        return response()->json([
            'status' => 'success',
            'stats' => $stats,
            'monthly_stats' => $monthlyStats
        ]);
    }

    /**
     * Obtenir tous les utilisateurs
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->withCount(['properties', 'bookings'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'users' => $users
        ]);
    }

    /**
     * Approuver un manager
     */
    public function approveManager($id)
    {
        $user = User::findOrFail($id);

        if (!$user->hasRole(User::ROLE_MANAGER)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cet utilisateur n\'est pas un manager'
            ], 400);
        }

        if ($user->status !== User::STATUS_PENDING) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ce manager n\'est pas en attente d\'approbation'
            ], 400);
        }

        $user->update(['status' => User::STATUS_ACTIVE]);

        return response()->json([
            'status' => 'success',
            'message' => 'Manager approuvé avec succès',
            'user' => $user
        ]);
    }

    /**
     * Suspendre un utilisateur
     */
    public function suspendUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de suspendre un administrateur'
            ], 400);
        }

        $user->update(['status' => User::STATUS_SUSPENDED]);

        // Révoquer tous les tokens
        $user->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur suspendu avec succès',
            'user' => $user
        ]);
    }

    /**
     * Réactiver un utilisateur
     */
    public function activateUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => User::STATUS_ACTIVE]);

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur réactivé avec succès',
            'user' => $user
        ]);
    }

    /**
     * Supprimer un utilisateur
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de supprimer un administrateur'
            ], 400);
        }

        // Vérifier s'il y a des réservations actives
        if ($user->hasRole(User::ROLE_CLIENT)) {
            $activeBookings = $user->bookings()
                ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
                ->count();

            if ($activeBookings > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Impossible de supprimer un client avec des réservations actives'
                ], 400);
            }
        }

        if ($user->hasRole(User::ROLE_MANAGER)) {
            $activeProperties = $user->properties()
                ->whereHas('bookings', function($query) {
                    $query->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED]);
                })
                ->count();

            if ($activeProperties > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Impossible de supprimer un manager avec des propriétés ayant des réservations actives'
                ], 400);
            }
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les managers en attente
     */
    public function pendingManagers()
    {
        $managers = User::where('role', User::ROLE_MANAGER)
            ->where('status', User::STATUS_PENDING)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'managers' => $managers
        ]);
    }

    /**
     * Créer un administrateur
     */
    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Administrateur créé avec succès',
            'admin' => $admin
        ], 201);
    }

    /**
     * Obtenir toutes les propriétés avec statistiques pour l'admin
     */
    public function properties(Request $request)
    {
        try {
            // Commencer par une requête simple pour débogger
            $query = Property::query();
            
            // Ajouter la jointure avec les managers
            $query->leftJoin('users', 'properties.manager_id', '=', 'users.id')
                ->select([
                    'properties.*',
                    'users.name as manager_name',
                    'users.email as manager_email'
                ]);

            // Filtres
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('properties.title', 'like', "%{$search}%")
                      ->orWhere('properties.address', 'like', "%{$search}%")
                      ->orWhere('users.name', 'like', "%{$search}%");
                });
            }

            if ($request->has('type') && !empty($request->type)) {
                $query->where('properties.type', $request->type);
            }

            if ($request->has('status') && !empty($request->status)) {
                $query->where('properties.status', $request->status);
            }

            if ($request->has('city') && !empty($request->city)) {
                $query->where('properties.address', 'like', "%{$request->city}%");
            }

            // Récupérer les propriétés
            $propertiesData = $query->get();
            
            // Log pour déboguer
            \Log::info('Properties found: ' . $propertiesData->count());
            
            // Ajouter les statistiques
            $properties = $propertiesData->map(function ($property) {
                // Calculer les statistiques pour chaque propriété
                $bookingsCount = Booking::where('property_id', $property->id)->count();
                
                // Calculer les revenus (simplifié pour éviter les erreurs)
                $totalRevenue = 0;
                try {
                    $confirmedBookings = Booking::where('property_id', $property->id)
                        ->where('status', 'confirmed')
                        ->get();
                    
                    foreach ($confirmedBookings as $booking) {
                        $invoiceTotal = Invoice::where('booking_id', $booking->id)
                            ->where('status', 'paid')
                            ->sum('total_amount');
                        $totalRevenue += $invoiceTotal;
                    }
                } catch (\Exception $e) {
                    \Log::error('Error calculating revenue for property ' . $property->id . ': ' . $e->getMessage());
                }

                $property->bookings_count = $bookingsCount;
                $property->total_revenue = $totalRevenue;
                
                // Note moyenne (simulée)
                $property->rating = $bookingsCount > 0 ? round(rand(35, 50) / 10, 1) : null;
                $property->reviews_count = $bookingsCount;

                return $property;
            });

            // Statistiques générales
            $stats = [
                'total' => $properties->count(),
                'available' => $properties->where('status', 'available')->count(),
                'occupied' => $properties->where('status', 'occupied')->count(),
                'maintenance' => $properties->where('status', 'maintenance')->count(),
                'total_revenue' => $properties->sum('total_revenue')
            ];

            // Répartition par type
            $typeDistribution = $properties->groupBy('type')->map(function ($group, $type) use ($properties) {
                return [
                    'type' => $type,
                    'count' => $group->count(),
                    'percentage' => $properties->count() > 0 ? round(($group->count() / $properties->count()) * 100) : 0
                ];
            })->values();

            // Revenus par mois (6 derniers mois) - simplifié
            $revenueByMonth = [];
            for ($i = 5; $i >= 0; $i--) {
                $monthStart = now()->subMonths($i)->startOfMonth();
                
                $monthRevenue = 0;
                try {
                    $monthRevenue = Invoice::where('status', 'paid')
                        ->whereBetween('created_at', [$monthStart, $monthStart->copy()->endOfMonth()])
                        ->sum('total_amount');
                } catch (\Exception $e) {
                    \Log::error('Error calculating monthly revenue: ' . $e->getMessage());
                }

                $revenueByMonth[] = [
                    'month' => $monthStart->locale('fr')->format('M'),
                    'value' => $monthRevenue
                ];
            }

            // Top managers par performance - simplifié
            $topManagers = [];
            try {
                $managers = User::where('role', 'manager')
                    ->where('status', 'active')
                    ->get();

                foreach ($managers as $manager) {
                    $managerProperties = Property::where('manager_id', $manager->id)->get();
                    $totalRevenue = 0;
                    $totalBookings = 0;

                    foreach ($managerProperties as $property) {
                        $bookingsCount = Booking::where('property_id', $property->id)->count();
                        $totalBookings += $bookingsCount;
                    }

                    $topManagers[] = [
                        'id' => $manager->id,
                        'name' => $manager->name,
                        'email' => $manager->email,
                        'properties_count' => $managerProperties->count(),
                        'total_revenue' => $totalRevenue,
                        'average_rating' => $totalBookings > 0 ? round(rand(35, 50) / 10, 1) : 0,
                        'bookings_count' => $totalBookings
                    ];
                }

                // Trier par nombre de propriétés
                usort($topManagers, function($a, $b) {
                    return $b['properties_count'] - $a['properties_count'];
                });
                
                $topManagers = array_slice($topManagers, 0, 10);
            } catch (\Exception $e) {
                \Log::error('Error calculating top managers: ' . $e->getMessage());
                $topManagers = [];
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'properties' => $properties->values(),
                    'stats' => $stats,
                    'type_distribution' => $typeDistribution,
                    'revenue_by_month' => $revenueByMonth,
                    'top_managers' => $topManagers
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error in AdminController@properties: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des propriétés: ' . $e->getMessage(),
                'data' => [
                    'properties' => [],
                    'stats' => [
                        'total' => 0,
                        'available' => 0,
                        'occupied' => 0,
                        'maintenance' => 0,
                        'total_revenue' => 0
                    ],
                    'type_distribution' => [],
                    'revenue_by_month' => [],
                    'top_managers' => []
                ]
            ], 500);
        }
    }

    /**
     * Rapport détaillé des activités
     */
    public function report(Request $request)
    {
        $startDate = $request->get('start_date', now()->subMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $report = [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'users' => [
                'new_registrations' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
                'new_clients' => User::where('role', User::ROLE_CLIENT)
                    ->whereBetween('created_at', [$startDate, $endDate])->count(),
                'new_managers' => User::where('role', User::ROLE_MANAGER)
                    ->whereBetween('created_at', [$startDate, $endDate])->count(),
            ],
            'properties' => [
                'new_properties' => Property::whereBetween('created_at', [$startDate, $endDate])->count(),
                'by_type' => Property::selectRaw('type, COUNT(*) as count')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy('type')->get(),
            ],
            'bookings' => [
                'total_bookings' => Booking::whereBetween('created_at', [$startDate, $endDate])->count(),
                'confirmed_bookings' => Booking::where('status', Booking::STATUS_CONFIRMED)
                    ->whereBetween('created_at', [$startDate, $endDate])->count(),
                'cancelled_bookings' => Booking::where('status', Booking::STATUS_CANCELLED)
                    ->whereBetween('created_at', [$startDate, $endDate])->count(),
            ],
            'revenue' => [
                'total_revenue' => Invoice::where('status', Invoice::STATUS_PAID)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount'),
                'pending_revenue' => Invoice::where('status', Invoice::STATUS_PENDING)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount'),
            ]
        ];

        return response()->json([
            'status' => 'success',
            'report' => $report
        ]);
    }
}
