<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Test\StoreRequest;
use App\Http\Requests\Test\UpdateRequest;
use App\Http\Resources\TestResource;
use App\Http\Resources\TestsResource;
use App\Http\Resources\TestWithDataResource;
use App\Models\Activity;
use App\Models\Test;
use App\Repositories\TestRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use function response;

class TestController extends Controller
{
    public function __construct(private TestRepository $testRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new TestsResource($this->testRepository->get()));
    }

    /**
     * @param Activity $activity
     * @return JsonResponse
     */
    public function getTestsByActivity(Activity $activity): JsonResponse
    {
        return response()->json(new TestsResource($activity->tests));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new TestResource($this->testRepository->create($request->input())));
    }

    /**
     * Update
     *
     * @param UpdateRequest $request
     * @param Test $test
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Test $test): JsonResponse
    {
        return response()->json(new TestResource($this->testRepository->updateById($test->id, $request->input())));
    }

    /**
     * Display
     *
     * @param Test $test
     * @return JsonResponse
     */
    public function show(Test $test): JsonResponse
    {
        return response()->json(new TestWithDataResource($test));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Test $test
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Test $test): JsonResponse
    {
        return response()->json($this->testRepository->deleteById($test->id));
    }
}
