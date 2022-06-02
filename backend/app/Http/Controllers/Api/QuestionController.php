<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\SyncAnswersRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuestionsResource;
use App\Models\Question;
use App\Repositories\QuestionRepository;
use Exception;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller
{

    public function __construct(private QuestionRepository $questionRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new QuestionsResource($this->questionRepository->get()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new QuestionResource($this->questionRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Question $question
     * @return JsonResponse
     */
    public function show(Question $question): JsonResponse
    {
        return response()->json(new QuestionResource($question));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Question $question
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Question $question): JsonResponse
    {
        return response()->json(new QuestionResource($this->questionRepository->updateById($question->id, $request->input())));

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Question $question
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Question $question): JsonResponse
    {
        return response()->json($this->questionRepository->deleteById($question->id));
    }

    public function syncAnswers(SyncAnswersRequest $request, Question $question): JsonResponse
    {
        $input = $request->input();
        $question->answers()->sync($input["answers"] ?? []);
        return response()->json(new QuestionResource($question->refresh()));
    }
}
