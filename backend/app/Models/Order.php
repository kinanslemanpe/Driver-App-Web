<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Order extends Model
{
    use HasApiTokens;
    protected $table = 'orders';
    protected $fillable = [
        'driver_id',
        'tracking_number',
        'receiver_name',
        'cod',
        'custom_fees',
        'client_name',
    ];
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
