<?php

// app/Traits/PDFControllerTrait.php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Response;

trait PDFControllerTrait
{
    public function servePDF($model, $id)
    {
        try {
            $item = $model::findOrFail($id);

            if (!$item || !$item->attachment) {
                return response()->json(['error' => 'PDF file not found'], 404);
            }

            $location = $item->attachment;
            $path = Storage::path($location);
            
            // Set cache control headers to prevent browser caching
            $headers = [
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma' => 'no-cache',
                'Expires' => 'Sat, 01 Jan 2000 00:00:00 GMT',
            ];

            return response()->file($path, $headers);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Resource not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}