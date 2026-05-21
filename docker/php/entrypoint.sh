#!/bin/sh
set -e

# Tự động composer install nếu chưa có vendor
if [ ! -f "vendor/autoload.php" ]; then
    echo ">>> Running composer install..."
    composer install --no-interaction --prefer-dist
fi

# Copy .env nếu chưa có
if [ ! -f ".env" ]; then
    echo ">>> Copying .env.example to .env..."
    cp .env.example .env
    php artisan key:generate
fi

# Fix permissions        ← thêm phần này
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

exec "$@"