<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\StoreRequest;
use App\Http\Requests\Lesson\UpdateRequest;
use App\Http\Resources\LessonResource;
use App\Http\Resources\LessonsPaginateResource;
use App\Http\Resources\LessonsResource;
use App\Http\Resources\LessonsWithMarksPaginateResource;
use App\Models\Lesson;
use App\Models\Semester;
use App\Models\Subject;
use App\Repositories\LessonRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LessonController extends Controller
{
    public function __construct(private LessonRepository $lessonRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new LessonsPaginateResource($this->lessonRepository->paginate()));
    }

    /**
     * @param Semester $semester
     * @param Subject $subject
     * @return JsonResponse
     */
    public function getLessonsBySemesterAndSubject(Semester $semester, Subject $subject): JsonResponse
    {
        return response()->json(new LessonsPaginateResource($this->lessonRepository
            ->where('semester_id', $semester->id)
            ->where('subject_id', $subject->id)
            ->paginate()));
    }
    public function getLessonsBySemesterAndSubjectWithMarks(Semester $semester, Subject $subject): JsonResponse
    {
        return response()->json(new LessonsWithMarksPaginateResource($this->lessonRepository
            ->where('semester_id', $semester->id)
            ->where('subject_id', $subject->id)
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
        return response()->json(new LessonResource($this->lessonRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Lesson $lesson
     * @return JsonResponse
     */
    public function show(Lesson $lesson): JsonResponse
    {
        return response()->json(new LessonResource($lesson));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Lesson $lesson
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Lesson $lesson): JsonResponse
    {
        return response()->json(new LessonResource($this->lessonRepository->updateById($lesson->id, $request->input())));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Lesson $lesson
     * @return bool
     * @throws \Exception
     */
    public function destroy(Lesson $lesson): bool
    {
        return $this->lessonRepository->deleteById($lesson->id);
    }
}
