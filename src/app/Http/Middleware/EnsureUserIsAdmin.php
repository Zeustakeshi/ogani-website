<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
	public function handle(Request $request, Closure $next): Response|JsonResponse
	{
		$user = $request->user();

		if (! $user || $user->role !== 'admin') {
			return response()->json([
				'message' => 'Only admin can perform this action.',
			], 403);
		}

		return $next($request);
	}
}