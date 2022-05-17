<?php



use App\Http\Controllers\Api\Auth\UserAuthApiController;
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


//Route::group(['prefix' => 'admin', 'middleware' => ['auth:admin-api', 'scopes:admin']], function ()
//{
//    // authenticated staff routes here
//    Route::get('dashboard', [AdminAuthApiController::class, 'dashboard']);
//    Route::get('blogs', [AdminBlogApiController::class, 'index']);
//    Route::get('categories', [AdminCategoryApiController::class, 'index']);
//    Route::post('categories/add', [AdminCategoryApiController::class, 'store']);
//    Route::get('categories/delete/{id}', [AdminCategoryApiController::class, 'destroy']);
//    Route::get('tags', [AdminTagApiController::class, 'index']);
//    Route::post('tags/add', [AdminTagApiController::class, 'store']);
//    Route::get('tags/delete/{id}', [AdminTagApiController::class, 'destroy']);
//    Route::post('logout', [AdminAuthApiController::class, 'logout']);
//});
