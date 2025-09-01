<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes (no auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public properties (for browsing)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Route de test pour les propriétés
Route::get('/test-properties', function (Request $request) {
    $propertyCount = \App\Models\Property::count();
    $managerCount = \App\Models\User::where('role', 'manager')->count();
    
    $sampleProperties = \App\Models\Property::with('manager')->take(3)->get();
    
    return response()->json([
        'status' => 'debug',
        'message' => 'Test de récupération des propriétés',
        'data' => [
            'total_properties' => $propertyCount,
            'total_managers' => $managerCount,
            'sample_properties' => $sampleProperties->map(function($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'manager_id' => $p->manager_id,
                    'manager_name' => $p->manager ? $p->manager->name : 'Aucun',
                    'status' => $p->status,
                    'type' => $p->type,
                    'images' => $p->images
                ];
            })
        ]
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::put('/user', [AuthController::class, 'updateUser']);
    Route::delete('/user', [AuthController::class, 'deleteUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    // Properties routes
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::post('/properties/{id}/update', [PropertyController::class, 'update']); // Route alternative pour FormData
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);

    // Bookings routes
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::get('/manager-bookings', [BookingController::class, 'managerBookings']);
    Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/properties', [AdminController::class, 'properties']);
        Route::get('/pending-managers', [AdminController::class, 'pendingManagers']);
        Route::post('/users/{id}/approve-manager', [AdminController::class, 'approveManager']);
        Route::post('/users/{id}/suspend', [AdminController::class, 'suspendUser']);
        Route::post('/users/{id}/activate', [AdminController::class, 'activateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/create-admin', [AdminController::class, 'createAdmin']);
        Route::get('/report', [AdminController::class, 'report']);
    });
});
