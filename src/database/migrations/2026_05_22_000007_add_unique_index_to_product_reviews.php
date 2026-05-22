<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement(<<<'SQL'
DELETE FROM product_reviews
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY product_id, user_id
                   ORDER BY created_at DESC, id DESC
               ) AS row_number
        FROM product_reviews
    ) ranked_reviews
    WHERE ranked_reviews.row_number > 1
);
SQL);

        Schema::table('product_reviews', function (Blueprint $table) {
            $table->unique(['product_id', 'user_id'], 'product_reviews_product_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            $table->dropUnique('product_reviews_product_user_unique');
        });
    }
};