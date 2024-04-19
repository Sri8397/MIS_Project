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
            return response()->file($path);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Resource not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}

