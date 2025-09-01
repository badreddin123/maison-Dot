<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Property;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Créer une réservation
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasRole(User::ROLE_CLIENT)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Seuls les clients peuvent faire des réservations'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
            'guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $property = Property::findOrFail($request->property_id);

        // Vérifier la disponibilité
        if (!$property->isAvailableForPeriod($request->start_date, $request->end_date)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette propriété n\'est pas disponible pour la période sélectionnée'
            ], 400);
        }

        // Calculer le prix total
        $totalPrice = $property->getTotalPrice($request->start_date, $request->end_date);

        $booking = Booking::create([
            'property_id' => $request->property_id,
            'client_id' => $request->user()->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_price' => $totalPrice,
            'guests' => $request->guests,
            'special_requests' => $request->special_requests,
            'status' => Booking::STATUS_PENDING,
        ]);

        // Créer la facture
        $invoice = Invoice::create([
            'booking_id' => $booking->id,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'amount' => $totalPrice,
            'total_amount' => (new Invoice())->calculateTotal(),
            'due_date' => now()->addDays(7),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Réservation créée avec succès',
            'booking' => $booking->load(['property', 'invoices']),
        ], 201);
    }

    /**
     * Obtenir les réservations de l'utilisateur connecté
     */
    public function myBookings(Request $request)
    {
        $bookings = Booking::where('client_id', $request->user()->id)
            ->with(['property', 'invoices'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'bookings' => $bookings
        ]);
    }

    /**
     * Obtenir une réservation spécifique
     */
    public function show(Request $request, $id)
    {
        $booking = Booking::with(['property', 'client', 'invoices'])->findOrFail($id);

        // Vérifier les permissions
        $user = $request->user();
        if (!$user->hasRole(User::ROLE_ADMIN) && 
            $booking->client_id !== $user->id && 
            $booking->property->manager_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'booking' => $booking
        ]);
    }

    /**
     * Confirmer une réservation (managers seulement)
     */
    public function confirm(Request $request, $id)
    {
        $booking = Booking::with('property')->findOrFail($id);

        // Vérifier que l'utilisateur est le manager de la propriété
        if ($booking->property->manager_id !== $request->user()->id && 
            !$request->user()->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        if ($booking->status !== Booking::STATUS_PENDING) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette réservation ne peut pas être confirmée'
            ], 400);
        }

        $booking->update(['status' => Booking::STATUS_CONFIRMED]);

        return response()->json([
            'status' => 'success',
            'message' => 'Réservation confirmée avec succès',
            'booking' => $booking
        ]);
    }

    /**
     * Annuler une réservation
     */
    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Vérifier les permissions
        $user = $request->user();
        if ($booking->client_id !== $user->id && 
            $booking->property->manager_id !== $user->id && 
            !$user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        if (!$booking->canBeCancelled()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette réservation ne peut pas être annulée'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $booking->update([
            'status' => Booking::STATUS_CANCELLED,
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        // Annuler les factures associées
        $booking->invoices()->update(['status' => Invoice::STATUS_CANCELLED]);

        return response()->json([
            'status' => 'success',
            'message' => 'Réservation annulée avec succès',
            'booking' => $booking
        ]);
    }

    /**
     * Obtenir les réservations d'un manager
     */
    public function managerBookings(Request $request)
    {
        if (!$request->user()->hasRole(User::ROLE_MANAGER)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $bookings = Booking::whereHas('property', function($query) use ($request) {
            $query->where('manager_id', $request->user()->id);
        })->with(['property', 'client', 'invoices'])
          ->orderBy('created_at', 'desc')
          ->paginate(10);

        return response()->json([
            'status' => 'success',
            'bookings' => $bookings
        ]);
    }

    /**
     * Toutes les réservations (admin seulement)
     */
    public function index(Request $request)
    {
        if (!$request->user()->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $bookings = Booking::with(['property', 'client', 'invoices'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'bookings' => $bookings
        ]);
    }
}
