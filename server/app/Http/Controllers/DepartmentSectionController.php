<?php

namespace App\Http\Controllers;

use App\Models\DepartmentSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DepartmentSectionController extends Controller
{
    public function index()
    {
        $departmentSections = DepartmentSection::all();
        return response()->json(['data' => $departmentSections], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:section,department',
            'name' => Rule::unique('department_sections')->where(function ($query) use ($request) {
                return $query->where('type', $request->type);
            }),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Validation failed.',
            ], 422);
        }

        $departmentSection = DepartmentSection::create($request->all());

        return response()->json(['message' => 'Department or section created successfully', 'data' => $departmentSection], 201);
    }

    public function show($id)
    {
        $departmentSection = DepartmentSection::find($id);

        if (!$departmentSection) {
            return response()->json(['error' => 'Department or section not found'], 404);
        }

        return response()->json(['data' => $departmentSection], 200);
    }
}
