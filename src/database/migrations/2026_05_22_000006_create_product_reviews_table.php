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
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('product_id');
            $table->text('review_text');
            $table->unsignedSmallInteger('rating');
            $table->timestamps();

            $table->index('product_id');
            $table->index('user_id');
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
        });

        DB::statement('ALTER TABLE products ALTER COLUMN rating TYPE NUMERIC(8,2) USING rating::numeric');
        DB::statement('ALTER TABLE products ALTER COLUMN rating SET DEFAULT 0');

        DB::unprepared(<<<'SQL'
CREATE OR REPLACE FUNCTION sync_product_review_stats()
RETURNS TRIGGER AS $$
DECLARE
    new_product_id text;
    old_product_id text;
BEGIN
    IF TG_OP = 'DELETE' THEN
        old_product_id := OLD.product_id;
    ELSE
        new_product_id := NEW.product_id;
    END IF;

    IF new_product_id IS NOT NULL THEN
        UPDATE products
        SET reviews = COALESCE((
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = new_product_id
        ), 0),
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM product_reviews
            WHERE product_id = new_product_id
        ), 0)
        WHERE id = new_product_id;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.product_id IS DISTINCT FROM NEW.product_id THEN
        old_product_id := OLD.product_id;
    END IF;

    IF old_product_id IS NOT NULL THEN
        UPDATE products
        SET reviews = COALESCE((
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = old_product_id
        ), 0),
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM product_reviews
            WHERE product_id = old_product_id
        ), 0)
        WHERE id = old_product_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_reviews_sync_stats ON product_reviews;
CREATE TRIGGER product_reviews_sync_stats
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION sync_product_review_stats();
SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS product_reviews_sync_stats ON product_reviews;');
        DB::unprepared('DROP FUNCTION IF EXISTS sync_product_review_stats();');

        DB::statement('ALTER TABLE products ALTER COLUMN rating DROP DEFAULT');
        DB::statement('ALTER TABLE products ALTER COLUMN rating TYPE INTEGER USING ROUND(rating)::integer');

        Schema::table('product_reviews', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        Schema::dropIfExists('product_reviews');
    }
};