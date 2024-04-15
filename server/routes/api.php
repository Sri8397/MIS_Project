<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UploadController;

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


// here add routes Module wise

include('adminRoutes.php');
include('userRoutes.php');
