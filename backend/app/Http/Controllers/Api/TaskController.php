<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Requests\Task\UpdateRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TasksResource;
use App\Http\Resources\TestResource;
use App\Models\Task;
use App\Models\Test;
use App\Repositories\TaskRepository;
use Exception;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function __construct(private TaskRepository $taskRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return \response()->json(new TasksResource($this->taskRepository->get()));
    }

    /**
     * @param Test $test
     * @return JsonResponse
     */
    public function getTasksByTest(Test $test): JsonResponse
    {
        return response()->json(new TasksResource($test->tasks));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new TaskResource($this->taskRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Task $task
     * @return JsonResponse
     */
    public function show(Task $task): JsonResponse
    {
        return response()->json(new TaskResource($task));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Task $task
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Task $task): JsonResponse
    {
        return response()->json(new TaskResource($this->taskRepository->updateById($task->id, $request->input())));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Task $task
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Task $task): JsonResponse
    {
        return response()->json($this->taskRepository->deleteById($task->id));
    }
}
