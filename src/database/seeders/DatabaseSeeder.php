<?php

namespace Database\Seeders;

use App\Models\Category;
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

        $categories = [
            [
                'name' => 'Thịt tươi',
                'description' => 'Các loại thịt tươi được tuyển chọn mỗi ngày.',
            ],
            [
                'name' => 'Rau củ',
                'description' => 'Rau củ sạch, tươi và giàu dinh dưỡng.',
            ],
            [
                'name' => 'Quà trái cây và hạt',
                'description' => 'Hộp quà kết hợp trái cây tươi và các loại hạt.',
            ],
            [
                'name' => 'Quả mọng tươi',
                'description' => 'Nhóm quả mọng tươi ngọt, mọng nước.',
            ],
            [
                'name' => 'Hải sản',
                'description' => 'Hải sản tươi ngon từ biển.',
            ],
            [
                'name' => 'Bơ và trứng',
                'description' => 'Các sản phẩm bơ và trứng dùng cho bữa ăn hằng ngày.',
            ],
            [
                'name' => 'Đồ ăn nhanh',
                'description' => 'Món ăn tiện lợi, nhanh gọn và dễ dùng.',
            ],
            [
                'name' => 'Hành tươi',
                'description' => 'Các loại hành tươi phục vụ nấu ăn.',
            ],
            [
                'name' => 'Đu đủ và đồ ăn vặt giòn',
                'description' => 'Đu đủ chín và các món snack giòn nhẹ.',
            ],
            [
                'name' => 'Yến mạch',
                'description' => 'Yến mạch và các sản phẩm ngũ cốc giàu năng lượng.',
            ],
            [
                'name' => 'Chuối tươi',
                'description' => 'Chuối tươi ngọt tự nhiên, giàu kali.',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::query()->updateOrCreate(
                ['name' => $categoryData['name']],
                ['description' => $categoryData['description']]
            );
        }

        $categoryIds = Category::query()->pluck('id')->all();

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

        Product::factory()
            ->count(8)
            ->state(fn (): array => [
                'category_id' => fake()->randomElement($categoryIds),
            ])
            ->create();
    }
}
