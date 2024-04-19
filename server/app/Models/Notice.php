<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title_en',
        'title_hi',
        'last_date_time',
        'attachment',
        'attachment_link',
        'remarks',
        'department_section_id',
        'priority'
    ];

    // You can define relationships or additional methods here
}
