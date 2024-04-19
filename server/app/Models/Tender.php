<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tender extends Model
{
    use HasFactory;

    protected $fillable = [
        'tender_number',
        'category_id',
        'brief_description_en',
        'brief_description_hi',
        'last_date_time',
        'intender_email',
        'attachment',
        'attachment_link',
        'remarks',
    ];

    protected $dates = [
        'last_date_time',
        'created_at',
        'updated_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
