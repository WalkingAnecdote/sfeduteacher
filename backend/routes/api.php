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
Route::get('subjects/teacher/{teacher}', [\App\Http\Controllers\Api\SubjectController::class, "getSubjectsByTeacher"]);
Route::post('semesters/{semester}/subjects/attach', [\App\Http\Controllers\Api\SemesterController::class, "addSubjects"])
    ->name('semesters.subjects.attach');
Route::post('semesters/{semester}/subjects/detach', [\App\Http\Controllers\Api\SemesterController::class, "removeSubjects"])
    ->name('semesters.subjects.detach');

Route::get('semesters/{semester}/subjects/marks', [\App\Http\Controllers\Api\SubjectController::class, "getSubjectsBySemesterWithMarks"]);
Route::get('semesters/{semester}/students/{student}/subjects/marks', [\App\Http\Controllers\Api\SubjectController::class, "getSubjectsBySemesterWithMarksByStudent"]);

Route::apiResource('semesters', \App\Http\Controllers\Api\SemesterController::class);
Route::get('subjects/{subject}/semesters', [\App\Http\Controllers\Api\SemesterController::class, "getSemestersBySubject"]);



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
Route::delete('students/{student}', [\App\Http\Controllers\Api\StudentController::class, "destroy"])
    ->name('students.delete');

Route::get('teachers', [\App\Http\Controllers\Api\TeacherController::class, "index"])
    ->name('teachers.get');
Route::get('teachers/{teacher}', [\App\Http\Controllers\Api\TeacherController::class, "show"])
    ->name('teachers.show');
Route::post('teachers', [\App\Http\Controllers\Api\TeacherController::class, "store"])
    ->name('teachers.create');
Route::post('teachers/{teacher}', [\App\Http\Controllers\Api\TeacherController::class, "update"])
    ->name('teachers.update');
Route::delete('teachers/{teacher}', [\App\Http\Controllers\Api\TeacherController::class, "destroy"])
    ->name('teachers.delete');

Route::apiResource('lessons', \App\Http\Controllers\Api\LessonController::class);
Route::get('semesters/{semester}/subjects/{subject}/lessons', [\App\Http\Controllers\Api\LessonController::class, "getLessonsBySemesterAndSubject"])
    ->name('semesters.subject.lessons.list');
Route::get('semesters/{semester}/subjects/{subject}/lessons/marks', [\App\Http\Controllers\Api\LessonController::class, "getLessonsBySemesterAndSubjectWithMarks"])
    ->name('semesters.subject.lessons.list.marks');

Route::apiResource('activities', \App\Http\Controllers\Api\ActivityController::class);
Route::get('lessons/{lesson}/activities', [\App\Http\Controllers\Api\ActivityController::class, "getActivitiesByLesson"])
    ->name('lessons.activities.list');
Route::post('activities/{activity}/students/{student}/mark', [\App\Http\Controllers\Api\ActivityController::class, "addMarkToStudent"])
    ->name('lessons.activities.students.add-mark');
Route::put('activities/{activity}/students/{student}/mark', [\App\Http\Controllers\Api\ActivityController::class, "updateMarkToStudent"])
    ->name('activities.students.update-mark');
Route::get('activities/{activity}/marks', [\App\Http\Controllers\Api\ActivityController::class, "showWithMarks"]);
Route::get('activities/marks/all', [\App\Http\Controllers\Api\ActivityController::class, "marks"]);

Route::apiResource('tests', \App\Http\Controllers\Api\TestController::class);
Route::get('activities/{activity}/tests', [\App\Http\Controllers\Api\TestController::class, "getTestsByActivity"]);

Route::apiResource('tasks', \App\Http\Controllers\Api\TaskController::class);
Route::get('tests/{test}/tasks', [\App\Http\Controllers\Api\TaskController::class, "getTasksByTest"]);

Route::apiResource('questions', \App\Http\Controllers\Api\QuestionController::class);
Route::post('questions/{question}/answers', [\App\Http\Controllers\Api\QuestionController::class, "syncAnswers"]);

Route::get('tests/{test}/students/{student}', [\App\Http\Controllers\Api\TestResultController::class, "getByTestAndStudent"]);
Route::post('tests/{test}/students/{student}/submit', [\App\Http\Controllers\Api\TestResultController::class, "store"]);
Route::get('tests/results/{result}', [\App\Http\Controllers\Api\TestResultController::class, "show"]);
Route::delete('tests/results/{result}', [\App\Http\Controllers\Api\TestResultController::class, "destroy"]);


Route::apiResource('answers', \App\Http\Controllers\Api\AnswerController::class);

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/me', [UserAuthApiController::class, 'me']);
    Route::delete('/delete-me', [UserAuthApiController::class, 'deleteMe']);
    Route::post('/logout', [UserAuthApiController::class, 'logout']);

    Route::get('chats', [\App\Http\Controllers\Api\ChatController::class, "getByParticipants"]);
    Route::get('chats/{chat}', [\App\Http\Controllers\Api\ChatController::class, "show"]);
    Route::put('chats/{chat}', [\App\Http\Controllers\Api\ChatController::class, "readChat"]);
    Route::post('chats', [\App\Http\Controllers\Api\ChatController::class, "createMessage"]);
});
