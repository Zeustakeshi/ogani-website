<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
	use HasFactory;

	protected $primaryKey = 'id';

	public $incrementing = false;

	protected $keyType = 'string';

	protected $fillable = [
		'name',
		'description',
	];

	protected static function booted(): void
	{
		static::creating(function (self $category): void {
			if (! $category->getKey()) {
				$category->setAttribute($category->getKeyName(), (string) Str::uuid());
			}
		});
	}

	public function products(): HasMany
	{
		return $this->hasMany(Product::class);
	}
}