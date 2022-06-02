<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Answer\StoreRequest;
use App\Http\Requests\Answer\UpdateRequest;
use App\Http\Resources\AnswerResource;
use App\Http\Resources\AnswersResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuestionsResource;
use App\Models\Answer;
use App\Repositories\AnswerRepository;
use Exception;
use Illuminate\Http\JsonResponse;

class AnswerController extends Controller
{

    public function __construct(private AnswerRepository $answerRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(new AnswersResource($this->answerRepository->get()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        return response()->json(new AnswerResource($this->answerRepository->create($request->input())));
    }

    /**
     * Display the specified resource.
     *
     * @param Answer $answer
     * @return JsonResponse
     */
    public function show(Answer $answer): JsonResponse
    {
        return response()->json(new AnswerResource($answer));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param Answer $answer
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, Answer $answer): JsonResponse
    {
        return response()->json(new AnswerResource($this->answerRepository->updateById($answer->id, $request->input())));

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Answer $answer
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Answer $answer): JsonResponse
    {
        return \response()->json($this->answerRepository->deleteById($answer->id));
    }
}
