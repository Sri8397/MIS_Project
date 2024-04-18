<?php

// app/Http/Controllers/DepartmentSectionController.php

namespace App\Http\Controllers;

use App\Models\DepartmentSection;
use Illuminate\Http\Request;

class DepartmentSectionController extends Controller
{
    public function index()
    {
        $departmentSections = DepartmentSection::all();

        return response()->json(['data' => $departmentSections], 200);
    }
}
