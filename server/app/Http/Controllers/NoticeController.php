<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\PDFControllerTrait;
use Illuminate\Support\Facades\Storage;

class NoticeController extends Controller
{
    use PDFControllerTrait;

    public function index()
    {
        $notices = Notice::all();

        $noticesData = [];

        foreach ($notices as $notice) {
            $data = [
                'id' => $notice->id,
                'title_en' => $notice->title_en,
                'title_hi' => $notice->title_hi,
                'last_date_time' => $notice->last_date_time,
                'remarks' => $notice->remarks,
                'department_section_id' => $notice->department_section_id,
                'priority' => $notice->priority,
                'created_at' => $notice->created_at,
                'updated_at' => $notice->updated_at,
            ];

            // If attachment is present, generate a clickable link for it
            if ($notice->attachment) {
                $data['attachment_link'] = route('notices.pdf', ['id' => $notice->id]);
            } else if ($notice->attachment_link) {
                $data['attachment_link'] = $notice->attachment_link;
            }

            $noticesData[] = $data;
        }

        return response()->json(['data' => $noticesData], 200);
    }

    public function show($id)
    {
        $notice = Notice::find($id);

        if (!$notice) {
            return response()->json(['error' => 'Notice not found'], 404);
        }

        $data = [
            'id' => $notice->id,
            'title_en' => $notice->title_en,
            'title_hi' => $notice->title_hi,
            'last_date_time' => $notice->last_date_time,
            'remarks' => $notice->remarks,
            'department_section_id' => $notice->department_section_id,
            'priority' => $notice->priority,
            'created_at' => $notice->created_at,
            'updated_at' => $notice->updated_at,
        ];

        // If attachment is present, generate a clickable link for it
        if ($notice->attachment) {
            $data['attachment_link'] = route('notices.pdf', ['id' => $notice->id]);
        } else if ($notice->attachment_link) {
            $data['attachment_link'] = $notice->attachment_link;
        }

        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title_en' => 'required|max:255',
            'title_hi' => 'required|max:255',
            'last_date_time' => 'required|date',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
            'department_section_id' => 'required|exists:department_sections,id',
            'priority' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'validation failed',
            ], 422);
        }

        $validatedData = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/notices', $fileName);
            $validatedData['attachment'] = $path;
        }

        $notice = Notice::create($validatedData);

        return response()->json(['message' => 'Notice created successfully', 'data' => $notice], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title_en' => 'sometimes|required|max:255',
            'title_hi' => 'sometimes|required|max:255',
            'last_date_time' => 'sometimes|required|date',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
            'attachment_link' => 'nullable|url',
            'remarks' => 'nullable|string',
            'department_section_id' => 'sometimes|required|exists:department_sections,id',
            'priority' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
                'message' => 'validation failed',
            ], 422);
        }

        $validatedData = $validator->validated();

        $notice = Notice::find($id);

        if (!$notice) {
            return response()->json(['error' => 'Notice not found'], 404);
        }

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete previous attachment if exists
            if ($notice->attachment) {
                Storage::delete($notice->attachment);
            }

            $file = $request->file('attachment');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('pdfs/notices', $fileName);
            $validatedData['attachment'] = $path;
        }

        $notice->update($validatedData);

        return response()->json(['message' => 'Notice updated successfully', 'data' => $notice], 200);
    }

    public function destroy($id)
    {
        $notice = Notice::find($id);

        if (!$notice) {
            return response()->json(['error' => 'Notice not found'], 404);
        }

        // Delete attachment if exists
        if ($notice->attachment) {
            Storage::delete($notice->attachment);
        }

        $notice->delete();

        return response()->json(['message' => 'Notice deleted successfully'], 200);
    }
}

