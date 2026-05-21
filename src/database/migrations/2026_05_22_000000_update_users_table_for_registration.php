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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'username')) {
                $table->string('username')->after('email');
            }

            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('username');
            }
        });

        DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey');
        DB::statement('ALTER TABLE users ADD PRIMARY KEY (email)');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'id')) {
                $table->dropColumn('id');
            }

            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }

            if (Schema::hasColumn('users', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }

            if (Schema::hasColumn('users', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });

        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_username_unique');

        Schema::table('users', function (Blueprint $table) {
            $table->id()->first();
            $table->string('name')->nullable()->after('id');
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->rememberToken()->after('password');
        });

        DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey');
        DB::statement('ALTER TABLE users ADD PRIMARY KEY (id)');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'phone']);
        });
    }
};