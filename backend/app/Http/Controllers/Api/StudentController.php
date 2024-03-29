<?php


namespace App\Http\Controllers\Api;


use App\Http\Requests\Student\StoreRequest;
use App\Http\Requests\Student\UpdateRequest;
use App\Http\Resources\StudentProfileResource;
use App\Http\Resources\StudentProfilesResource;
use App\Models\Group;
use App\Models\StudentProfile;
use App\Repositories\StudentRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class StudentController
{

    public function __construct(private StudentRepository $studentRepository, private UserRepository $userRepository)
    {
    }

    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new StudentProfilesResource($this->studentRepository->get()));
    }

    /**
     * @param Group $group
     * @return JsonResponse
     */
    public function getStudentsByGroup(Group $group): JsonResponse
    {
        return response()->json(new StudentProfilesResource($group->students()->get()));
    }

    /**
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function show(StudentProfile $student): JsonResponse
    {
        return response()->json(new StudentProfileResource($student));
    }

    /**
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $input = $request->input();
        $user = $this->userRepository->create($input['user']);
        $roleStudent = Role::where('name', "student")->firstOrFail();
        $profile = $this->studentRepository->create($input['profile']);
        $profile->user()->save($user);
        $user->assignRole($roleStudent);
        return response()->json(new StudentProfileResource($profile));
    }

    /**
     * @param UpdateRequest $request
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, StudentProfile $student): JsonResponse
    {
        $input = $request->input();

        if(isset($input["user"]["password"])) {
            $input["user"]["password"] = Hash::make($input["user"]["password"]);
        }

        $this->userRepository->updateById($student->user->id, $input['user']?? []);
        return response()->json(new StudentProfileResource($this->studentRepository->updateById($student->id, $input['profile']?? [])));
    }

    public function destroy(StudentProfile $student): JsonResponse
    {
        (new UserRepository)->deleteById($student?->user?->id);
        (new StudentRepository())->deleteById($student->id);
        return response()->json(true);
    }
}
