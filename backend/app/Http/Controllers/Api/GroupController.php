<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Group\StoreRequest;
use App\Http\Requests\Group\UpdateRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\GroupsResource;
use App\Models\Group;
use App\Repositories\GroupRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GroupController extends Controller
{
    public function __construct(private GroupRepository $groupRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        return response()->json(new GroupsResource($this->groupRepository->get()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new GroupResource($this->groupRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Group $group
     * @return JsonResponse
     */
    public function show(Group $group): JsonResponse
    {
        return response()->json(new GroupResource($group));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Group $group
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Group $group): JsonResponse
    {
        return response()->json(new GroupResource($this->groupRepository->updateById($group->id, $request->input())));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Group $group
     * @return JsonResponse
     * @throws \Exception
     */
    public function destroy(Group $group): JsonResponse
    {
        return response()->json($this->groupRepository->deleteById($group->id));
    }
}
