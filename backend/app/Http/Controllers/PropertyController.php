<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    /**
     * Obtenir toutes les propriétés (pour les clients)
     */
    public function index(Request $request)
    {
        $query = Property::with('manager')
            ->where('status', 'available');

        // Filtres
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $properties = $query->paginate(12);

        return response()->json([
            'status' => 'success',
            'properties' => $properties
        ]);
    }

    /**
     * Obtenir une propriété par ID
     */
    public function show($id)
    {
        $property = Property::with(['manager', 'bookings' => function($query) {
            $query->where('status', 'confirmed')
                  ->where('end_date', '>=', now())
                  ->select('property_id', 'start_date', 'end_date');
        }])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'property' => $property
        ]);
    }

    /**
     * Créer une nouvelle propriété (managers seulement)
     */
    public function store(Request $request)
    {
        // Vérifier que l'utilisateur est un manager actif
        if (!$request->user()->hasRole(User::ROLE_MANAGER) || !$request->user()->isActive()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:house,apartment,office',
            'price_per_night' => 'required|numeric|min:0',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'area' => 'nullable|numeric|min:0',
            'guests' => 'sometimes|integer|min:1',
            'amenities' => 'nullable|string',
            'featured' => 'sometimes|in:true,false,1,0',
        ]);

        // Validation séparée pour les images si présentes
        if ($request->hasFile('images')) {
            $imageValidator = Validator::make($request->all(), [
                'images' => 'array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            if ($imageValidator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erreur de validation des images',
                    'errors' => $imageValidator->errors()
                ], 400);
            }
        }

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Traitement des images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            $uploadPath = 'uploads/properties';
            $fullUploadPath = public_path($uploadPath);
            
            // Créer le dossier s'il n'existe pas
            if (!file_exists($fullUploadPath)) {
                if (!mkdir($fullUploadPath, 0755, true)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Impossible de créer le dossier d\'upload'
                    ], 500);
                }
            }

            // Vérifier que le dossier est accessible en écriture
            if (!is_writable($fullUploadPath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Le dossier d\'upload n\'est pas accessible en écriture'
                ], 500);
            }

            $images = $request->file('images');
            if (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $index => $image) {
                if ($image && $image->isValid()) {
                    try {
                        // Générer un nom unique pour l'image
                        $extension = $image->getClientOriginalExtension();
                        $filename = time() . '_' . $index . '_' . uniqid() . '.' . $extension;
                        
                        // Déplacer l'image vers le dossier public
                        if ($image->move($fullUploadPath, $filename)) {
                            $imagePaths[] = $uploadPath . '/' . $filename;
                        } else {
                            // Log l'erreur mais continue avec les autres images
                            \Log::error('Impossible de déplacer l\'image: ' . $image->getClientOriginalName());
                        }
                    } catch (\Exception $e) {
                        \Log::error('Erreur lors du traitement de l\'image: ' . $e->getMessage());
                    }
                }
            }
        }

        $property = Property::create([
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'price_per_night' => $request->price_per_night,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'area' => $request->area,
            'guests' => $request->guests ?? 2,
            'amenities' => $request->amenities ? json_decode($request->amenities, true) : [],
            'images' => $imagePaths,
            'featured' => $request->has('featured') ? in_array($request->featured, ['true', '1', 1, true], true) : false,
            'manager_id' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Propriété créée avec succès',
            'property' => $property->load('manager')
        ], 201);
    }

    /**
     * Mettre à jour une propriété
     */
    public function update(Request $request, $id)
    {
        \Log::info('Property update request received', [
            'property_id' => $id,
            'user_id' => $request->user()->id,
            'request_method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'has_files' => $request->hasFile('images'),
            'request_keys' => array_keys($request->all())
        ]);
        
        $property = Property::findOrFail($id);

        // Vérifier que l'utilisateur est le propriétaire ou un admin
        if (!$request->user()->hasRole(User::ROLE_ADMIN) && 
            $property->manager_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:house,apartment,office',
            'price_per_night' => 'sometimes|numeric|min:0',
            'address' => 'sometimes|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:1',
            'area' => 'nullable|numeric|min:0',
            'guests' => 'sometimes|integer|min:1',
            'amenities' => 'nullable|string', // JSON string
            'images' => 'nullable|array',
            'status' => 'sometimes|in:available,occupied,maintenance',
            'featured' => 'sometimes|in:true,false,1,0',
        ]);

        // Validation des images si présentes
        if ($request->hasFile('images')) {
            $imageValidator = Validator::make($request->all(), [
                'images' => 'array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            if ($imageValidator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erreur de validation des images',
                    'errors' => $imageValidator->errors()
                ], 400);
            }
        }

        if ($validator->fails()) {
            \Log::error('Validation failed for property update', [
                'property_id' => $id,
                'user_id' => $request->user()->id,
                'request_data' => $request->except(['images']), // Exclure les images des logs
                'validation_errors' => $validator->errors()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 400);
        }

        // Traitement des nouvelles images si elles sont présentes
        $imagePaths = $property->images; // Conserver les images existantes par défaut
        
        if ($request->hasFile('images')) {
            // Créer un dossier spécifique pour cette propriété
            $uploadPath = "uploads/properties/{$property->id}";
            $fullUploadPath = public_path($uploadPath);
            
            // Créer le dossier s'il n'existe pas
            if (!file_exists($fullUploadPath)) {
                mkdir($fullUploadPath, 0755, true);
            }

            // Supprimer les anciennes images du dossier
            if (is_dir($fullUploadPath)) {
                $files = glob($fullUploadPath . '/*');
                foreach($files as $file) {
                    if(is_file($file)) {
                        unlink($file);
                    }
                }
            }

            // Traiter les nouvelles images
            $imagePaths = [];
            foreach ($request->file('images') as $index => $image) {
                if ($image && $image->isValid()) {
                    try {
                        // Générer un nom de fichier unique
                        $extension = $image->getClientOriginalExtension();
                        $filename = time() . '_' . uniqid() . '_' . ($index + 1) . '.' . $extension;
                        
                        // Déplacer l'image vers le dossier spécifique de la propriété
                        if ($image->move($fullUploadPath, $filename)) {
                            $imagePaths[] = $uploadPath . '/' . $filename;
                        } else {
                            \Log::error('Impossible de déplacer l\'image: ' . $image->getClientOriginalName());
                        }
                    } catch (\Exception $e) {
                        \Log::error('Erreur lors du traitement de l\'image: ' . $e->getMessage());
                    }
                }
            }
        }

        // Préparer les données à mettre à jour
        $updateData = $request->only([
            'title', 'description', 'type', 'price_per_night', 'address',
            'latitude', 'longitude', 'bedrooms', 'bathrooms', 'area',
            'guests', 'status'
        ]);
        
        // Traitement spécial pour les amenities (JSON string -> array)
        if ($request->has('amenities')) {
            $amenities = $request->amenities;
            if (is_string($amenities)) {
                $updateData['amenities'] = json_decode($amenities, true) ?: [];
            } else {
                $updateData['amenities'] = $amenities ?: [];
            }
        }
        
        // Traitement spécial pour featured (string -> boolean)
        if ($request->has('featured')) {
            $featured = $request->featured;
            $updateData['featured'] = in_array($featured, ['true', '1', 1, true], true);
        }
        
        // Ajouter les images
        $updateData['images'] = $imagePaths;

        $property->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Propriété mise à jour avec succès',
            'property' => $property
        ]);
    }

    /**
     * Supprimer une propriété
     */
    public function destroy(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        // Vérifier que l'utilisateur est le propriétaire ou un admin
        if (!$request->user()->hasRole(User::ROLE_ADMIN) && 
            $property->manager_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        // Vérifier qu'il n'y a pas de réservations actives
        $activeBookings = $property->bookings()
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        if ($activeBookings > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de supprimer une propriété avec des réservations actives'
            ], 400);
        }

        $property->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Propriété supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les propriétés d'un manager
     */
    public function myProperties(Request $request)
    {
        if (!$request->user()->hasRole(User::ROLE_MANAGER)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $properties = Property::where('manager_id', $request->user()->id)
            ->with('bookings')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'properties' => $properties
        ]);
    }
}
