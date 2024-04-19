<?php

namespace App\Http\Controllers;

use App\Models\Tender;
use Illuminate\Http\Request;
use App\Traits\PDFControllerTrait;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TenderController extends Controller
{
    use PDFControllerTrait;

    public function index()
    {
        $tenders = Tender::all();

        $tendersData = [];

        foreach ($tenders as $tender) {
            $data = [
                'id' => $tender->id,
                'tender_number' => $tender->tender_number,
                'category' => $tender->category,
                'brief_description_en' => $tender->brief_description_en,
                'brief_description_hi' => $tender->brief_description_hi,
                'last_date_time' => $tender->last_date_time,
                'intender_email' => $tender->intender_email,
                'remarks' => $tender->remarks,
                'created_at' => $tender->created_at,
                'updated_at' => $tender->updated_at,
            ];

            // If attachment is present, generate a clickable link for it
            if ($tender->attachment) {
                $data['attachment_link'] = route('tenders.pdf', ['id' => $tender->id]);
            } else if ($tender->attachment_link) {
                $data['attachment_link'] = $tender->attachment_link;
            }

            $tendersData[] = $data;
        }

        return response()->json(['data' => $tendersData], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tender_number' => 'required|integer',
            'category' => 'required|max:255',
            'brief_description_en' => 'required|max:255',
            'brief_description_hi' => 'required|max:255',
            'last_date_time' => [
                'required',
                'date',
                'after_or_equal:' . Date::now()->addDays(2)->toDateString(), // Ensure the date is at least two days in the future
            ],
            'intender_email' => 'required|email',
            'attachment' => 'nullable|file|mimes:pdf|max:2048',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Either file is not uploaded or file is not pdf or file size is greater than 2MB.',
            ], 422);
        }

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/office-tenders', $fileName);
            $request['attachment'] = $path;
        }

        $tender = Tender::create($request->all());

        return response()->json(['message' => 'Tender created successfully', 'data' => $tender], 201);
    }

    public function show($id)
    {
        $tender = Tender::find($id);

        if (!$tender) {
            return response()->json(['error' => 'Tender not found'], 404);
        }

        $data = [
            'id' => $tender->id,
            'tender_number' => $tender->tender_number,
            'category' => $tender->category,
            'brief_description_en' => $tender->brief_description_en,
            'brief_description_hi' => $tender->brief_description_hi,
            'last_date_time' => $tender->last_date_time,
            'intender_email' => $tender->intender_email,
            'remarks' => $tender->remarks,
            'created_at' => $tender->created_at,
            'updated_at' => $tender->updated_at,
        ];

        // If attachment is present, generate a clickable link for it
        if ($tender->attachment) {
            $data['attachment_link'] = route('tenders.pdf', ['id' => $tender->id]);
        } else if ($tender->attachment_link) {
            $data['attachment_link'] = $tender->attachment_link;
        }

        return response()->json(['data' => $data], 200);
    }

    public function update(Request $request, $id)
    {
        $tender = Tender::find($id);

        if (!$tender) {
            return response()->json(['error' => 'Tender not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tender_number' => 'sometimes|required|integer',
            'category' => 'sometimes|required|max:255',
            'brief_description_en' => 'sometimes|required|max:255',
            'brief_description_hi' => 'sometimes|required|max:255',
            'last_date_time' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:' . Date::now()->addDays(2)->toDateString(), // Ensure the date is at least two days in the future
            ],
            'intender_email' => 'sometimes|required|email',
            'attachment' => 'nullable|file|mimes:pdf|max:2048',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Either file is not uploaded or file is not pdf or file size is greater than 2MB.',
            ], 422);
        }

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete the old file, if exists
            if ($tender->attachment) {
                Storage::delete($tender->attachment);
            }

            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/tenders', $fileName);
            $request['attachment'] = $path;
        }

        $tender->update($request->all());

        return response()->json(['message' => 'Tender updated successfully', 'data' => $tender], 200);
    }

    public function destroy($id)
    {
        $tender = Tender::find($id);

        if (!$tender) {
            return response()->json(['error' => 'Tender not found'], 404);
        }

        // Delete the attached file, if any
        if ($tender->attachment) {
            Storage::delete($tender->attachment);
        }

        $tender->delete();

        return response()->json(['message' => 'Tender deleted successfully'], 200);
    }
}
