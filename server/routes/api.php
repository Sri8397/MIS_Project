<?php

use App\Http\Controllers\OfficeOrderController;
use App\Http\Controllers\TenderController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\DepartmentSectionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UploadController;
use App\Models\OfficeOrder;
use App\Models\Tender;
use App\Models\Notice;

/*
|--------------------------------------------------------------------------
| API Routes by @bhijeet
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::fallback(function () {
    return response()->json([
        'status' => false,
        'message' => 'Invalid Route !!',
    ], 200);
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('validateuser', 'validateUser');

    Route::post('login_api', 'login_api');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::get('refresh', 'refresh');
    Route::post('update_password', 'UpdatePassword');
    Route::post('un-block-user', 'unBlockUser');
    Route::get('TokenError', 'TokenError')->name('TokenError');
    Route::get('get-unread-notification', 'getUnReadNotification');
    Route::get('get-read-notification', 'getReadNotification');
    Route::post('mark-read-notification', 'markReadNotification');
    Route::post('GetBiometicAttendance', 'GetBiometicAttendance');
});

Route::prefix('uploads')->middleware('auth.check')->group(function () {
    Route::controller(UploadController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('{id}', 'show');
    });
});


use App\Http\Controllers\CategoryController;

Route::get('categories', [CategoryController::class, 'index']);
Route::post('categories', [CategoryController::class, 'store']);
Route::get('categories/{id}', [CategoryController::class, 'show']);




Route::get('department-sections', [DepartmentSectionController::class, 'index']);
Route::post('department-sections', [DepartmentSectionController::class, 'store']);
Route::get('department-sections/{id}', [DepartmentSectionController::class, 'show']);

// Office Order Routes
Route::get('office-orders', [OfficeOrderController::class, 'index']);
Route::post('office-orders', [OfficeOrderController::class, 'store']);
Route::get('office-orders/{id}', [OfficeOrderController::class, 'show']);
Route::put('office-orders/{id}', [OfficeOrderController::class, 'update']);
Route::delete('office-orders/{id}', [OfficeOrderController::class, 'destroy']);

// Office Order PDF Route
// Route::get('office-orders/{id}/pdf', [OfficeOrderController::class, 'servePDF'])->name('office-orders.pdf');

Route::get('office-orders/{id}/pdf', function ($id) {
    return (new OfficeOrderController)->servePDF(OfficeOrder::class, $id);
})->name('office-orders.pdf');

// Tender Routes
Route::get('tenders', [TenderController::class, 'index']);
Route::post('tenders', [TenderController::class, 'store']);
Route::get('tenders/{id}', [TenderController::class, 'show']);
Route::put('tenders/{id}', [TenderController::class, 'update']);
Route::delete('tenders/{id}', [TenderController::class, 'destroy']);

// Tender PDF Route
// Route::get('tenders/{id}/pdf', [TenderController::class, 'servePDF'])->name('tenders.pdf');
Route::get('tenders/{id}/pdf', function ($id) {
    return (new TenderController)->servePDF(Tender::class, $id);
})->name('tenders.pdf');

// Notice Routes
Route::get('notices', [NoticeController::class, 'index']);
Route::post('notices', [NoticeController::class, 'store']);
Route::get('notices/{id}', [NoticeController::class, 'show']);
Route::put('notices/{id}', [NoticeController::class, 'update']);
Route::delete('notices/{id}', [NoticeController::class, 'destroy']);
// Route::get('notices/{id}/pdf', [NoticeController::class, 'servePDF'])->name('notices.pdf');


// Notice PDF Route
// Route::get('tenders/{id}/pdf', [TenderController::class, 'servePDF'])->name('tenders.pdf');
Route::get('notices/{id}/pdf', function ($id) {
    return (new NoticeController)->servePDF(Notice::class, $id);
})->name('notices.pdf');


// here add routes Module wise
include('adminRoutes.php');
include('userRoutes.php');
