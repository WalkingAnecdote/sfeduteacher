<?php

namespace App\Http\Controllers\Api\Auth;

use App\Exceptions\ValidationError;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource as UserResource;
use App\Http\Resources\UserWithProfileResource;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\User;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Lcobucci\JWT\Configuration;
use Spatie\Permission\Models\Role;

class UserAuthApiController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse|bool
     */
    public function register(Request $request): JsonResponse|bool
    {
        $validator = Validator::make($request->all(), [
            'first_name'     => 'required|max:255',
            'last_name'     => 'required|max:255',
            'middle_name'     => 'required|max:255',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
            'user_type' => ['required', Rule::in(['teacher', 'student', 'admin'])]
        ]);

        if ($validator->fails())
        {
            $response = [
                'error' => TRUE,
                'message' => $validator->errors()->all()
            ];
            return response()->json($response, 400);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        switch ($request->user_type) {
            case 'admin':
                $roleAdmin = Role::where('name', "admin")->firstOrFail();
                $user->assignRole($roleAdmin);
                break;
            case 'teacher':
                $roleTeacher = Role::where('name', "teacher")->firstOrFail();
                $profile = TeacherProfile::create();
                $profile->user()->save($user);
                $user->assignRole($roleTeacher);
                break;
            case 'student':
                $roleStudent = Role::where('name', "student")->firstOrFail();
                $profile = StudentProfile::create();
                $profile->user()->save($user);
                $user->assignRole($roleStudent);
                break;
        }

        if ($user)
        {
            $args = [
                'username' => $request->email,
                'password' => $request->password,
            ];
            $credentials = $this->buildCredentials($args);

            $response = $this->makeRequest($credentials);


            return response()->json($response, 200);
        } else {
            return response()->isServerError();
        }
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $credentials = $this->buildCredentials($request->toArray(), 'refresh_token');

        $response = $this->makeRequest($credentials);

        return response()->json($response);
    }


    /**
     * @param $accessToken
     *
     * @return false|mixed
     */
    public function parseToken($accessToken)
    {
        $config = Configuration::forUnsecuredSigner();

        $token = $config->parser()->parse((string) $accessToken);

        $claims = $token->claims();

        return $claims->get('sub');
    }
    /**
     * @param array $args
     * @param string $grantType
     *
     * @return array
     */
    public function buildCredentials(array $args = [], $grantType = 'password'): array
    {
        $args = collect($args);
        $credentials = $args->except(['directive', 'administration', 'telephone', 'code'])->toArray();
        $credentials['client_id'] = $args->get('client_id', config('passport.password_grant_client.client_id'));
        $credentials['client_secret'] = $args->get('client_secret', config('passport.password_grant_client.client_secret'));
        $credentials['grant_type'] = $grantType;

        return $credentials;
    }

    /**
     * @param array $credentials
     * @return mixed
     * @throws Exception
     */
    public function makeRequest(array $credentials): mixed
    {
        $request = Request::create('oauth/token', 'POST', $credentials, [], [], [
            'HTTP_Accept' => 'application/json',
        ]);
        $response = app()->handle($request);
        $decodedResponse = json_decode($response->getContent(), true);
        if ($response->getStatusCode() != 200) {
            throw new ValidationError(response()->json(['error' => $decodedResponse['message']], 401));
        }

        return $decodedResponse;
    }


    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json(['error' => $validator->errors()->all()]);
        }

        $args = [
            'username' => $request->email,
            'password' => $request->password,
        ];
        $credentials = $this->buildCredentials($args);

        $response = $this->makeRequest($credentials);

        return response()->json($response, 200);
    }

    public function logout(Request $request)
    {
        if (!Auth::guard('api')->check()) {
            throw new AuthenticationException();
        }

        $request->user()->currentAccessToken()->revoke();

        return response()->json([
            'status' => 'TOKEN_REVOKED',
            'message' => __('Your session has been terminated'),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(new UserWithProfileResource(User::find($request->user()->id)));
    }

    public function deleteMe(Request $request)
    {
        return response()->json(User::where('id', $request->user()->id)->delete());
    }
}
