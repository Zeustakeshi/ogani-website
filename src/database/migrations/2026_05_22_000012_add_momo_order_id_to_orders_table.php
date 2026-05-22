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
        if (! Schema::hasColumn('orders', 'momo_order_id')) {
            Schema::table('orders', function (Blueprint $table): void {
                $table->string('momo_order_id')->nullable()->after('status');
            });
        }

        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS orders_momo_order_id_unique ON orders (momo_order_id)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS orders_momo_order_id_unique');

        Schema::table('orders', function (Blueprint $table): void {
            if (Schema::hasColumn('orders', 'momo_order_id')) {
                $table->dropColumn('momo_order_id');
            }
        });
    }
};