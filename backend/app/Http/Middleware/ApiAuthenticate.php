<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if (!auth('sanctum')->check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated. Please provide a valid token.'
                ], 401);
            }
        } catch (AuthenticationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication failed. Invalid or expired token.'
            ], 401);
        }

        return $next($request);
    }
}
