<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\Middleware\Authenticate as AuthAuthenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
	$middleware->alias([
		'admin' => EnsureUserIsAdmin::class,
	]);

	AuthAuthenticate::redirectUsing(function ($request) {
		if (
			$request->expectsJson() ||
			$request->wantsJson() ||
			$request->is('api/*') ||
			str_contains($request->header('Accept') ?? '', 'text/event-stream')
		) {
			return null;
		}

		return '/login';
	});
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
