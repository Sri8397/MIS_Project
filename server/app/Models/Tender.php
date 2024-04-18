<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tender extends Model
{
    protected $fillable = [
        'tender_number',
        'category',
        'brief_description_en',
        'brief_description_hi',
        'last_date_time',
        'intender_email',
        'attachment',
        'attachment_link',
        'remarks',
    ];

    protected $dates = ['last_date_time'];

    // Additional model logic, relationships, etc. can be defined here
}
