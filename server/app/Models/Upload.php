<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Upload extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'name',
        'user_id',
        'original_name',
        'file_path', 
        'size',
    ];
}
