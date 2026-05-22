<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		DB::statement('ALTER TABLE orders ALTER COLUMN coupon_code TYPE VARCHAR(255)');
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		DB::statement('ALTER TABLE orders ALTER COLUMN coupon_code TYPE VARCHAR(6)');
	}
};