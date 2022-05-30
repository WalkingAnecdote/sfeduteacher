<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\StoreRequest;
use App\Http\Requests\Activity\UpdateRequest;
use App\Http\Resources\ActivitiesPaginateResource;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ActivityWithMarksResource;
use App\Http\Resources\LessonsPaginateResource;
use App\Http\Resources\MarkResource;
use App\Models\Activity;
use App\Models\Lesson;
use App\Models\StudentProfile;
use App\Repositories\ActivityRepository;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{

    public function __construct(private ActivityRepository $activityRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new ActivitiesPaginateResource($this->activityRepository->paginate()));
    }

    /**
     * @param Lesson $lesson
     * @return JsonResponse
     */
    public function getActivitiesByLesson(Lesson $lesson): JsonResponse
    {
        return response()->json(new ActivitiesPaginateResource($this->activityRepository
            ->where('lesson_id', $lesson->id)
            ->paginate()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new ActivityResource($this->activityRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Activity $activity
     * @return JsonResponse
     */
    public function show(Activity $activity): JsonResponse
    {
        return response()->json(new ActivityResource($activity));
    }

    public function showWithMarks(Activity $activity): JsonResponse
    {
        return response()->json(new ActivityWithMarksResource($activity));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Activity $activity
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Activity $activity): JsonResponse
    {
        return response()->json(new ActivityResource($this->activityRepository->updateById($activity->id, $request->input())));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Activity $activity
     * @return bool
     * @throws \Exception
     */
    public function destroy(Activity $activity): bool
    {
        return $this->activityRepository->deleteById($activity->id);
    }

    /**
     * @param \App\Http\Requests\Mark\UpdateRequest $request
     * @param Activity $activity
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function addMarkToStudent(\App\Http\Requests\Mark\StoreRequest $request, Activity $activity, StudentProfile $student): JsonResponse
    {
        return response()->json(new MarkResource($this->activityRepository->addMark($request->input() + [
            'activity_id' => $activity->id,
            'student_id' => $student->id,
        ])));
    }

    /**
     * @param \App\Http\Requests\Mark\UpdateRequest $request
     * @param Activity $activity
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function updateMarkToStudent(\App\Http\Requests\Mark\UpdateRequest $request, Activity $activity, StudentProfile $student): JsonResponse
    {
        return response()->json(new MarkResource($this->activityRepository->updateMark($request->input() + [
                'activity_id' => $activity->id,
                'student_id' => $student->id,
            ])));
    }
}
