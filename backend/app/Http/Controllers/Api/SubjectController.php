<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subject\StoreRequest;
use App\Http\Requests\Subject\UpdateRequest;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\SubjectsPaginateResource;
use App\Http\Resources\SubjectsResource;
use App\Http\Resources\SubjectsWithMarksResource;
use App\Models\Semester;
use App\Models\StudentProfile;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Repositories\SubjectRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SubjectController extends Controller
{
    public function __construct(private SubjectRepository $subjectRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        return response()->json(new SubjectsPaginateResource($this->subjectRepository->paginate()));
    }

    /**
     * Get Subjects By Semester
     *
     * @param Semester $semester
     * @return JsonResponse
     */
    public function getSubjectsBySemester(Semester $semester): JsonResponse
    {
        return response()->json(new SubjectsPaginateResource($semester->subjects()->paginate()));
    }
    public function getSubjectsByTeacher(TeacherProfile $teacher): JsonResponse
    {
        return response()->json(new SubjectsPaginateResource($teacher->subjects()->paginate()));
    }

    public function getSubjectsBySemesterWithMarks(Semester $semester): JsonResponse
    {
        foreach ($semester->subjects as $subject) {
            $subject->semester_id = $semester->id;
        }
        return response()->json(new SubjectsWithMarksResource($semester->subjects));
    }

    public function getSubjectsBySemesterWithMarksByStudent(Semester $semester, StudentProfile $student): JsonResponse
    {
        foreach ($semester->subjects as $subject) {
            $subject->semester_id = $semester->id;
            $subject->student_id = $student->id;
        }
        return response()->json(new SubjectsWithMarksResource($semester->subjects));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new SubjectResource($this->subjectRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Subject $subject
     * @return JsonResponse
     */
    public function show(Subject $subject): JsonResponse
    {
        return response()->json(new SubjectResource($subject));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Subject $subject
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Subject $subject): JsonResponse
    {
        return response()->json(new SubjectResource($this->subjectRepository->updateById($subject->id, $request->input())));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Subject $subject
     * @return JsonResponse
     * @throws \Exception
     */
    public function destroy(Subject $subject): JsonResponse
    {
        return response()->json($this->subjectRepository->deleteById($subject->id));
    }
}
