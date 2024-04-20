<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DepartmentSectionController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\OfficeOrderController;
use App\Http\Controllers\TenderController;
use Illuminate\Support\Facades\Route;
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

// Fallback route for invalid routes
Route::fallback(function () {
    return response()->json([
        'status' => false,
        'message' => 'Invalid Route !!',
    ], 200);
});

// Authentication Routes
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


Route::prefix('categories')->middleware('AuthCheck')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
});

// Department Sections Routes
Route::prefix('department-sections')->middleware('AuthCheck')->group(function () {
    Route::get('', [DepartmentSectionController::class, 'index']);
    Route::post('', [DepartmentSectionController::class, 'store']);
    Route::get('{id}', [DepartmentSectionController::class, 'show']);
});

// Office Orders Routes
Route::prefix('office-orders')->middleware('AuthCheck')->group(function () {
    Route::get('', [OfficeOrderController::class, 'index']);
    Route::post('', [OfficeOrderController::class, 'store']);
    Route::get('{id}', [OfficeOrderController::class, 'show']);
    Route::post('{id}', [OfficeOrderController::class, 'update']);
    Route::delete('{id}', [OfficeOrderController::class, 'destroy']);
    Route::get('{id}/pdf/{filename}', function ($id) {
        return (new OfficeOrderController)->servePDF(OfficeOrder::class, $id);
    })->name('office-orders.pdf');
});

// Tenders Routes
Route::prefix('tenders')->middleware('AuthCheck')->group(function () {
    Route::get('', [TenderController::class, 'index']);
    Route::post('', [TenderController::class, 'store']);
    Route::get('{id}', [TenderController::class, 'show']);
    Route::post('{id}', [TenderController::class, 'update']);
    Route::delete('{id}', [TenderController::class, 'destroy']);
    Route::get('{id}/pdf/{filename}', function ($id) {
        return (new TenderController)->servePDF(Tender::class, $id);
    })->name('tenders.pdf');
});

// Notices Routes
Route::prefix('notices')->middleware('AuthCheck')->group(function () {
    Route::get('', [NoticeController::class, 'index']);
    Route::post('', [NoticeController::class, 'store']);
    Route::get('{id}', [NoticeController::class, 'show']);
    Route::post('{id}', [NoticeController::class, 'update']);
    Route::delete('{id}', [NoticeController::class, 'destroy']);
    Route::get('{id}/pdf/{filename}', function ($id) {
        return (new NoticeController)->servePDF(Notice::class, $id);
    })->name('notices.pdf');
});

// Include additional routes module-wise
include ('adminRoutes.php');
include ('userRoutes.php');