<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'type',
        'amount',
        'token',
        'session_id',
        'status',
    ];
}
