<?php


namespace App\Http\Controllers\Api;


use App\Http\Requests\Teacher\StoreRequest;
use App\Http\Requests\Teacher\UpdateRequest;
use App\Http\Resources\TeacherProfileResource;
use App\Http\Resources\TeachersProfilePaginateResource;
use App\Http\Resources\TeachersProfileResource;
use App\Models\TeacherProfile;
use App\Repositories\TeacherRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TeacherController
{

    public function __construct(private TeacherRepository $teacherRepository, private UserRepository $userRepository)
    {
    }

    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new TeachersProfilePaginateResource($this->teacherRepository->paginate()));
    }

    /**
     * @param TeacherProfile $teacher
     * @return JsonResponse
     */
    public function show(TeacherProfile $teacher): JsonResponse
    {
        return response()->json(new TeacherProfileResource($teacher));
    }

    /**
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $input = $request->input();
        $user = $this->userRepository->create($input['user']);
        $roleStudent = Role::where('name', "teacher")->firstOrFail();
        $profile = $this->teacherRepository->create($input['profile']);
        $profile->user()->save($user);
        $user->assignRole($roleStudent);
        return response()->json(new TeacherProfileResource($profile));
    }

    /**
     * @param UpdateRequest $request
     * @param TeacherProfile $teacher
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, TeacherProfile $teacher): JsonResponse
    {
        $input = $request->input();

        if(isset($input["user"]["password"])) {
            $input["user"]["password"] = Hash::make($input["user"]["password"]);
        }
        $this->userRepository->updateById($teacher->user->id, $input['user'] ?? []);
        return response()->json(new TeacherProfileResource($this->teacherRepository->updateById($teacher->id, $input['profile'] ?? [])));
    }

    public function destroy(TeacherProfile $teacher): JsonResponse
    {
        return response()->json((new UserRepository)->deleteById($teacher?->user?->id));
    }
}
