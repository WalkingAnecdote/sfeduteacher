<?php

use App\Http\Controllers\Api\Auth\UserAuthApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [UserAuthApiController::class, 'register']);
Route::post('/login', [UserAuthApiController::class, 'login']);
Route::post('/refresh', [UserAuthApiController::class, 'refreshToken']);
Route::apiResource('groups', \App\Http\Controllers\Api\GroupController::class);
Route::apiResource('subjects', \App\Http\Controllers\Api\SubjectController::class);
Route::apiResource('semesters', \App\Http\Controllers\Api\SemesterController::class);


Route::get('groups/{group}/semesters', [\App\Http\Controllers\Api\SemesterController::class, "index"])
    ->name('groups.semesters.list');
Route::post('groups/{group}/semesters', [\App\Http\Controllers\Api\SemesterController::class, "store"])
    ->name('groups.semesters.create');
Route::get('groups/{group}/semesters/{semester}', [\App\Http\Controllers\Api\SemesterController::class, "show"])
    ->name('groups.semesters.show');
Route::delete('groups/{group}/semesters/{semester}', [\App\Http\Controllers\Api\SemesterController::class, "destroy"])
    ->name('groups.semesters.delete');
Route::put('groups/{group}/semesters/{semester}', [\App\Http\Controllers\Api\SemesterController::class, "update"])
    ->name('groups.semesters.update');


Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/me', [UserAuthApiController::class, 'me']);
    Route::post('/logout', [UserAuthApiController::class, 'logout']);
});
