<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Product extends Model
{
	use HasFactory;

	protected $primaryKey = 'id';

	public $incrementing = false;

	protected $keyType = 'string';

	protected $fillable = [
		'category_id',
		'name',
		'reviews',
		'rating',
		'price',
		'description',
		'is_availability',
		'weight',
		'images',
	];

	protected $casts = [
		'reviews' => 'integer',
		'rating' => 'integer',
		'price' => 'integer',
		'is_availability' => 'boolean',
		'weight' => 'float',
		'images' => 'array',
	];

	protected static function booted(): void
	{
		static::creating(function (self $product): void {
			if (! $product->getKey()) {
				$product->setAttribute($product->getKeyName(), (string) Str::uuid());
			}
		});
	}

	public function category(): BelongsTo
	{
		return $this->belongsTo(Category::class);
	}
}