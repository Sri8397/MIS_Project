<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Upload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Exception;

class UploadController extends Controller
{
    public function index() {
        // $uploads = Upload::all();
        $uploads =  Upload::where("user_id", Auth::user()->id)->get();
        if (count($uploads) == 0) {
            return response()->json([
                'status'=> 404,
                'message'=> 'No response found.'
            ], 404);
        }
        $data = [
            'message'=> 200, 
            'uploads'=> $uploads
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request) {
        // validate the incoming file
        $validator = Validator::make($request->all(), [
            'file_upload' => 'required|mimes:pdf|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422, 
                'errors' => $validator->messages(), 
                'message' => 'either file is not uploaded or file is not pdf or file size is greater than 2MB.',
            ], 422);
        }

        $file = $request->file('file_upload');
        $fileName = uniqid().'_'.$file->getClientOriginalName();
        $fileSize = $file->getSize();
        // $file_path = $file->store('uploads', $fileName);
        $file_path = $file->storeAs('uploads', $fileName);
        // Auth::user()->id;
        $upload = Upload::create([
            'name'=> $fileName,
            'user_id'=> Auth::user()->id,
            'original_name'=> $file->getClientOriginalName(),
            'file_path'=> $file_path, 
            'size'=> $fileSize
        ]);

        if($upload) {
            return response()->json([
                'status'=> 201,
                'message'=> 'File uploaded successfully'
            ], 201);
        }
        return response()->json([
            'status'=> 500,
            'message'=> 'Something went wrong'
        ], 500);
    }

    public function show($id) {
        $upload = Upload::find($id);
        if (!$upload) {
            return response()->json([
                'status'=> 404,
                'message'=> 'No such file found!',
            ], 404);
        }
        $location = $upload->file_path;
        try {
            $path = Storage::path($location);
            return response()->file($path);
        }  
        //catch exception
        catch(Exception $e) {
            return response()->json([ 
                'status'=> 500,
                'message'=> 'Something went wrong! '.$e->getMessage()
            ], 500); 
        }
        
        // return response()->download($path);
    }
}
