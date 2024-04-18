<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeOrder extends Model
{
    protected $fillable = [
        'title_en',
        'title_hi',
        'last_date_time',
        'attachment',
        'attachment_link',
        'remarks',
        'department_section_id',
    ];

    public function departmentSection()
    {
        return $this->belongsTo(DepartmentSection::class, 'department_section_id');
    }
}
