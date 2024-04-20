<?php

namespace App\Http\Controllers;

use App\Models\Tender;
use Illuminate\Http\Request;
use App\Traits\PDFControllerTrait;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TenderController extends Controller
{
    use PDFControllerTrait;

    public function index()
    {
        $tenders = Tender::orderBy('updated_at', 'desc')->get();

        $tendersData = [];

        foreach ($tenders as $tender) {
            $data = [
                'id' => $tender->id,
                'tender_number' => $tender->tender_number,
                'category_id' => $tender->category_id,
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
                // Extract filename from the original attachment link
                $filename = Str::afterLast($tender->attachment, '/');

                // Generate the attachment link with the desired format
                $attachmentLink = Str::beforeLast($filename, '_') . '.pdf';

                // Append the attachment link to the existing route
                $data['attachment_link'] = route('tenders.pdf', ['id' => $tender->id, 'filename' => $attachmentLink]);
            } else if ($tender->attachment_link) {
                $data['attachment_link'] = $tender->attachment_link;
            }

            $tendersData[] = $data;
        }

        return response()->json(['data' => $tendersData], 200);
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
            'category_id' => $tender->category_id,
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
            // $data['attachment_link'] = route('tenders.pdf', ['id' => $tender->id]);

            // Extract filename from the original attachment link
            $filename = Str::afterLast($tender->attachment, '/');

            // Generate the attachment link with the desired format
            $attachmentLink = Str::beforeLast($filename, '_') . '.pdf';

            // Append the attachment link to the existing route
            $data['attachment_link'] = route('tenders.pdf', ['id' => $tender->id, 'filename' => $attachmentLink]);
        } else if ($tender->attachment_link) {
            $data['attachment_link'] = $tender->attachment_link;
        }

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tender_number' => 'required|integer|unique:tenders',
            'category_id' => 'required|exists:categories,id',
            'brief_description_en' => 'required|max:255',
            'brief_description_hi' => 'required|max:255',
            'last_date_time' => [
                'required',
                'date',
                'after_or_equal:' . Date::now()->addDays(2)->toDateString(),
            ],
            'intender_email' => 'required|email',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Validation failed',
            ], 422);
        }

        $validatedData = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/office-tenders', $fileName);
            $validatedData['attachment'] = $path;
        }

        $tender = Tender::create($validatedData);

        return response()->json(['message' => 'Tender created successfully', 'data' => $tender], 201);
    }


    public function update(Request $request, $id)
    {
        $tender = Tender::find($id);

        if (!$tender) {
            return response()->json(['error' => 'Tender not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tender_number' => 'sometimes|required|integer|unique:tenders,tender_number,' . $id,
            'category_id' => 'sometimes|required|exists:categories,id',
            'brief_description_en' => 'sometimes|required|max:255',
            'brief_description_hi' => 'sometimes|required|max:255',
            'last_date_time' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:' . Date::now()->addDays(2)->toDateString(),
            ],
            'intender_email' => 'sometimes|required|email',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'Validation failed',
            ], 422);
        }

        $validatedData = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete the old file, if exists
            if ($tender->attachment) {
                Storage::delete($tender->attachment);
            }

            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/tenders', $fileName);
            $validatedData['attachment'] = $path;
        }

        $tender->update($validatedData);

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
