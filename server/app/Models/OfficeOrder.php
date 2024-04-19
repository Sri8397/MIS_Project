<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_en',
        'title_hi',
        'last_date_time',
        'remarks',
        'department_section_id',
        'attachment',
        'attachment_link',
    ];

    protected $dates = [
        'last_date_time',
        'created_at',
        'updated_at',
    ];

    public function departmentSection()
    {
        return $this->belongsTo(DepartmentSection::class);
    }
}
