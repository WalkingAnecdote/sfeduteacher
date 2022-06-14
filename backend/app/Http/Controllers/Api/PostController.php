<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StoreRequest;
use App\Http\Requests\Post\UpdateRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostsResource;
use App\Models\Post;
use App\Models\Subject;
use App\Repositories\PostRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{

    public function __construct(private PostRepository $postRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new PostsResource($this->postRepository->get()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new PostResource($this->postRepository->create($request->input() + ['user_id' => Auth::id() ?? 1])));
    }

    /**
     * Display the specified resource.
     *
     * @param Post $post
     * @return JsonResponse
     */
    public function show(Post $post): JsonResponse
    {
        return response()->json(new PostResource($post));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Post $post
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Post $post): JsonResponse
    {
        return response()->json(new PostResource($this->postRepository->updateById($post->id, $request->input())));

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Post $post
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Post $post): JsonResponse
    {
        return response()->json($this->postRepository->deleteById($post->id));
    }

    public function getBySubject(Subject $subject): JsonResponse
    {
        return response()->json(new PostsResource($this->postRepository->where('subject_id', $subject->id)->get()));
    }
}
