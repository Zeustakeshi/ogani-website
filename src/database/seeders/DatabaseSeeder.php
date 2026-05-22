<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::query()->updateOrCreate(
            ['email' => config('app.admin_email')],
            [
                'username' => 'admin',
                'phone' => null,
                'role' => 'admin',
                'password' => Hash::make(config('app.admin_password')),
            ]
        );

        User::query()->updateOrCreate([
            'email' => 'test@example.com',
        ], [
            'username' => 'testuser',
            'phone' => '0123456789',
            'role' => 'user',
            'password' => Hash::make('password'),
        ]);

		Product::factory()->count(8)->create();
    }
}
