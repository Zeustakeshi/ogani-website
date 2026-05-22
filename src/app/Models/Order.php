<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_CANCEL = 'cancel';
    public const STATUS_SHIPPING = 'shipping';
    public const STATUS_SUCCESS = 'success';

    public const STATUS_LABELS = [
        self::STATUS_PENDING => 'Chờ thanh toán',
        self::STATUS_PAID => 'Đã thanh toán',
        self::STATUS_CANCEL => 'Đã hủy',
        self::STATUS_SHIPPING => 'Đang giao hàng',
        self::STATUS_SUCCESS => 'Thành công',
    ];

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'status',
        'momo_order_id',
        'coupon_code',
        'total',
        'address',
        'note',
        'momo_trans_id',
        'paid_at',
        'created_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'total' => 'integer',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function statusLabel(): string
    {
        return self::STATUS_LABELS[$this->status] ?? ucfirst((string) $this->status);
    }
}