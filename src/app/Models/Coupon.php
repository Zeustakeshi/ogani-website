<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
	use HasFactory;

	protected $fillable = [
		'code',
		'name',
		'description',
		'discount_percent',
		'expire_at',
	];

	protected $casts = [
		'discount_percent' => 'integer',
		'expire_at' => 'datetime',
	];
}