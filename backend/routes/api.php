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
Route::get('semesters/{semester}/subjects', [\App\Http\Controllers\Api\SubjectController::class, "getSubjectsBySemester"])
    ->name('groups.semesters.list');
Route::post('semesters/{semester}/subjects/attach', [\App\Http\Controllers\Api\SemesterController::class, "addSubjects"])
    ->name('semesters.subjects.attach');
Route::post('semesters/{semester}/subjects/detach', [\App\Http\Controllers\Api\SemesterController::class, "removeSubjects"])
    ->name('semesters.subjects.detach');
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


Route::get('students', [\App\Http\Controllers\Api\StudentController::class, "index"])
    ->name('students.get');
Route::get('students/{student}', [\App\Http\Controllers\Api\StudentController::class, "show"])
    ->name('students.show');
Route::get('groups/{group}/students', [\App\Http\Controllers\Api\StudentController::class, "getStudentsByGroup"])
    ->name('groups.students.get');
Route::post('students', [\App\Http\Controllers\Api\StudentController::class, "store"])
    ->name('students.create');
Route::post('students/{student}', [\App\Http\Controllers\Api\StudentController::class, "update"])
    ->name('students.update');

Route::get('teachers', [\App\Http\Controllers\Api\TeacherController::class, "index"])
    ->name('teachers.get');
Route::get('teachers/{teacher}', [\App\Http\Controllers\Api\TeacherController::class, "show"])
    ->name('teachers.show');
Route::post('teachers', [\App\Http\Controllers\Api\TeacherController::class, "store"])
    ->name('teachers.create');
Route::post('teachers/{teacher}', [\App\Http\Controllers\Api\TeacherController::class, "update"])
    ->name('teachers.update');

Route::apiResource('lessons', \App\Http\Controllers\Api\LessonController::class);
Route::get('semesters/{semester}/subjects/{subject}/lessons', [\App\Http\Controllers\Api\LessonController::class, "getLessonsBySemesterAndSubject"])
    ->name('semesters.subject.lessons.list');

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/me', [UserAuthApiController::class, 'me']);
    Route::post('/logout', [UserAuthApiController::class, 'logout']);
});
