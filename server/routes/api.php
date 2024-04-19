<?php

use App\Http\Controllers\OfficeOrderController;
use App\Http\Controllers\TenderController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\DepartmentSectionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
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

Route::prefix('catgories')->middleware('auth.check')->group(function () {
    Route::controller(CategoryController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('{id}', 'show');
    });
});

Route::prefix('department-sections')->middleware('auth.check')->group(function () {
    Route::controller(DepartmentSectionController::class)->group(function () {
        Route::get('', [DepartmentSectionController::class, 'index']);
        Route::post('', [DepartmentSectionController::class, 'store']);
        Route::get('{id}', [DepartmentSectionController::class, 'show']);
    });
});

Route::prefix('office-orders')->middleware('auth.check')->group(function () {
    Route::controller(OfficeOrderController::class)->group(function () {
        // Office Order Routes
        Route::get('', [OfficeOrderController::class, 'index']);
        Route::post('', [OfficeOrderController::class, 'store']);
        Route::get('{id}', [OfficeOrderController::class, 'show']);
        Route::post('{id}', [OfficeOrderController::class, 'update']);
        Route::delete('{id}', [OfficeOrderController::class, 'destroy']);
        Route::get('{id}/pdf', function ($id) {
            return (new OfficeOrderController)->servePDF(OfficeOrder::class, $id);
        })->name('office-orders.pdf');
    });
});

Route::prefix('tenders')->middleware('auth.check')->group(function () {
    Route::controller(TenderController::class)->group(function () {
        // Office Order Routes
        Route::get('', [TenderController::class, 'index']);
        Route::post('', [TenderController::class, 'store']);
        Route::get('{id}', [TenderController::class, 'show']);
        Route::post('{id}', [TenderController::class, 'update']);
        Route::delete('{id}', [TenderController::class, 'destroy']);
        Route::get('{id}/pdf', function ($id) {
            return (new TenderController)->servePDF(OfficeOrder::class, $id);
        })->name('office-orders.pdf');
    });
});


Route::prefix('notices')->middleware('auth.check')->group(function () {
    Route::controller(NoticeController::class)->group(function () {
        // Office Order Routes
        Route::get('', [NoticeController::class, 'index']);
        Route::post('', [NoticeController::class, 'store']);
        Route::get('{id}', [NoticeController::class, 'show']);
        Route::post('{id}', [NoticeController::class, 'update']);
        Route::delete('{id}', [NoticeController::class, 'destroy']);
        Route::get('{id}/pdf', function ($id) {
            return (new NoticeController)->servePDF(OfficeOrder::class, $id);
        })->name('office-orders.pdf');
    });
});

// here add routes Module wise
include ('adminRoutes.php');
include ('userRoutes.php');
