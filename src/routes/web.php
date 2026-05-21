<?php

use Illuminate\Support\Facades\Route;

// Serve the single Blade view for any route so React Router can handle client-side routing.
Route::get('/{any}', fn () => view('welcome'))->where('any', '.*');
