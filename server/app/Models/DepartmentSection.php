<?php

// app\Models\DepartmentSection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentSection extends Model
{
    protected $fillable = [
        'type', // department or section
        'name',
    ];

    public function officeOrders()
    {
        return $this->hasMany(OfficeOrder::class);
    }
}
