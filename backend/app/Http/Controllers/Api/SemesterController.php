<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Semester\AddSubjectsRequest;
use App\Http\Requests\Semester\RemoveSubjectsRequest;
use App\Http\Requests\Semester\StoreRequest;
use App\Http\Requests\Semester\UpdateRequest;
use App\Http\Resources\SemestersResource;
use App\Http\Resources\SemesterResource;
use App\Models\Group;
use App\Models\Semester;
use App\Repositories\GroupRepository;
use App\Repositories\SemesterRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SemesterController extends Controller
{
    public function __construct(private SemesterRepository $semesterRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param Group $group
     * @return JsonResponse
     */
    public function index(Group $group)
    {
        return response()->json(
            new SemestersResource($group->semesters()->paginate())
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @param Group $group
     * @return JsonResponse
     */
    public function store(StoreRequest $request, Group $group): JsonResponse
    {
        return response()->json(new SemesterResource($this->semesterRepository->create($request->input() + ['group_id' => $group->id])));
    }

    public function addSubjects(AddSubjectsRequest $request, Semester $semester): JsonResponse
    {
        try {
            $ids = explode(",", $request->subjects);
            $semester->subjects()->attach($ids);

            return response()->json(true);
        }
        catch(\Exception $exception) {
            return response()->json(false, 400);
        }
    }

    public function removeSubjects(RemoveSubjectsRequest $request, Semester $semester): JsonResponse
    {
        try {
            $ids = explode(",", $request->subjects);
            $semester->subjects()->detach($ids);

            return response()->json(true);
        }
        catch(\Exception $exception) {
            return response()->json(false, 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Group $group
     * @param Semester $semester
     * @return JsonResponse
     */
    public function show(Group $group, Semester $semester): JsonResponse
    {
        return response()->json(new SemesterResource($semester));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Group $group
     * @param Semester $semester
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Group $group, Semester $semester)
    {
        return response()->json(new SemesterResource($this->semesterRepository->updateById($semester->id,$request->input() + ['group_id' => $group->id])));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Group $group
     * @param Semester $semester
     * @return JsonResponse
     * @throws \Exception
     */
    public function destroy(Group $group, Semester $semester)
    {
        return response()->json($this->semesterRepository->deleteById($semester->id));
    }
}
