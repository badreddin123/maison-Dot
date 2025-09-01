<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:client,manager',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Les managers doivent être approuvés par un admin
        $status = $request->role === 'manager' ? User::STATUS_PENDING : User::STATUS_ACTIVE;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $status,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $message = $request->role === 'manager' 
            ? 'Inscription réussie. Votre compte manager est en attente d\'approbation.'
            : 'Inscription réussie.';

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Vérifier le statut du compte
        if (!$user->isActive()) {
            $message = $user->isPending() 
                ? 'Votre compte est en attente d\'approbation par un administrateur.'
                : 'Votre compte a été suspendu.';
                
            return response()->json([
                'status' => 'error',
                'message' => $message
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Connexion réussie',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Get authenticated user info
     */
    public function getUser(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()
        ]);
    }

    /**
     * Update user information
     */
    public function updateUser(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteUser(Request $request)
    {
        $user = $request->user();
        
        // Revoke all tokens
        $user->tokens()->delete();
        
        // Delete user
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User account deleted successfully'
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User logged out successfully'
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User logged out from all devices successfully'
        ]);
    }
}
