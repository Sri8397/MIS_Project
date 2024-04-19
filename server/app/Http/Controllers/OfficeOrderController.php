<?php

namespace App\Http\Controllers;

use App\Models\OfficeOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Traits\PDFControllerTrait;
use Illuminate\Support\Facades\Date;
use Exception;

class OfficeOrderController extends Controller
{

    use PDFControllerTrait;
    
    public function index()
    {
        $officeOrders = OfficeOrder::all();

        $officeOrdersData = [];

        foreach ($officeOrders as $officeOrder) {
            $data = [
                'id' => $officeOrder->id,
                'title_en' => $officeOrder->title_en,
                'title_hi' => $officeOrder->title_hi,
                'last_date_time' => $officeOrder->last_date_time,
                'remarks' => $officeOrder->remarks,
                'department_section_id' => $officeOrder->department_section_id,
                'created_at' => $officeOrder->created_at,
                'updated_at' => $officeOrder->updated_at,
            ];

            // If attachment is present, generate a clickable link for it
            if ($officeOrder->attachment) {
                $data['attachment_link'] = route('office-orders.pdf', ['id' => $officeOrder->id]);
            } else if ($officeOrder->attachment_link) {
                $data['attachment_link'] = $officeOrder->attachment_link;
            }

            $officeOrdersData[] = $data;
        }

        return response()->json(['data' => $officeOrdersData], 200);
    }


    public function show($id)
    {
        $officeOrder = OfficeOrder::find($id);

        if (!$officeOrder) {
            return response()->json(['error' => 'Office order not found'], 404);
        }

        $data = [
            'id' => $officeOrder->id,
            'title_en' => $officeOrder->title_en,
            'title_hi' => $officeOrder->title_hi,
            'last_date_time' => $officeOrder->last_date_time,
            'remarks' => $officeOrder->remarks,
            'department_section_id' => $officeOrder->department_section_id,
            'created_at' => $officeOrder->created_at,
            'updated_at' => $officeOrder->updated_at,
        ];

        // If attachment is present, generate a clickable link for it
        if ($officeOrder->attachment) {
            $data['attachment_link'] = route('office-orders.pdf', ['id' => $officeOrder->id]);
        } else if ($officeOrder->attachment_link) {
            $data['attachment_link'] = $officeOrder->attachment_link;
        }

        return response()->json(['data' => $data], 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title_en' => 'required|max:255',
            'title_hi' => 'required|max:255',
            'last_date_time' => [
                'required',
                'date',
                'after_or_equal:' . Date::now()->addDays(2)->toDateString(), // Ensure the date is at least two days in the future
            ],
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
            'department_section_id' => 'required|exists:department_sections,id',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Either file is not uploaded or file is not pdf or file size is greater than 2MB.',
            ], 422);
        }

        // Get validated data
        $validatedData = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/office-orders', $fileName);
            $validatedData['attachment'] = $path;
        }

        $officeOrder = OfficeOrder::create($validatedData);

        return response()->json(['message' => 'Office order created successfully', 'data' => $officeOrder], 201);
    }


    public function update(Request $request, $id)
    {
        $officeOrder = OfficeOrder::find($id);

        if (!$officeOrder) {
            return response()->json(['error' => 'Office order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title_en' => 'sometimes|required|max:255',
            'title_hi' => 'sometimes|required|max:255',
            'last_date_time' => 'sometimes|required|date',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
            'department_section_id' => 'sometimes|required|exists:department_sections,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Either file is not uploaded or file is not pdf or file size is greater than 5MB.',
            ], 422);
        }

        // Get validated data
        $validatedData = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete the old file, if exists
            if ($officeOrder->attachment) {
                Storage::delete($officeOrder->attachment);
            }

            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/office-orders', $fileName);
            $validatedData['attachment'] = $path;
        }

        $officeOrder->update($validatedData);

        return response()->json(['message' => 'Office order updated successfully', 'data' => $officeOrder], 200);
    }


    public function destroy($id)
    {
        $officeOrder = OfficeOrder::find($id);

        if (!$officeOrder) {
            return response()->json(['error' => 'Office order not found'], 404);
        }

        // Delete the attached PDF file, if any
        if ($officeOrder->attachment) {
            Storage::delete($officeOrder->attachment);
        }

        $officeOrder->delete();

        return response()->json(['message' => 'Office order deleted successfully'], 200);
    }
}
