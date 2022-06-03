<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestResult\StoreRequest;
use App\Http\Resources\TestResource;
use App\Http\Resources\TestResultResource;
use App\Http\Resources\TestResultsResource;
use App\Http\Resources\TestsResource;
use App\Models\StudentProfile;
use App\Models\Task;
use App\Models\Test;
use App\Models\TestResult;
use App\Repositories\TestResultRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use function response;

class TestResultController extends Controller
{
    public function __construct(private TestResultRepository $testResultRepository)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param Test $test
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function getByTestAndStudent(Test $test, StudentProfile $student): JsonResponse
    {
        return response()->json(new TestResultsResource($this->testResultRepository
            ->where('test_id', $test->id)
            ->where("student_id", $student->id)
            ->get()));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @param Test $test
     * @param StudentProfile $student
     * @return JsonResponse
     */
    public function store(StoreRequest $request, Test $test, StudentProfile $student): JsonResponse
    {
        $input = $request->input();
        $student_answers = json_decode($input['student_answers']);
        foreach ($student_answers as $student_answer) {
            if ($task = $test->tasks()->where('id', $student_answer->task_id)->first()) {
                if ($task->type == Task::QUIZ_TYPE) {
                    if ($task->correct_answer_id == $student_answer->answer_id) {
                        $student_answer->value = $task->value;
                    } else {
                        $student_answer->value = 0;
                    }
                }
                if ($task->type == Task::MONO_TYPE) {
                    if ($correct_answer = $task->correct_answer) {
                        if ($correct_answer->text == $student_answer->text) {
                            $student_answer->value = $task->value;
                        } else {
                            $student_answer->value = 0;
                        }
                    }
                }
            }
        }

        $total_score = 0;
        foreach ($student_answers as $student_answer) {
            $total_score += $student_answer->value;
        }

        return response()->json(new TestResultResource($this->testResultRepository->create(
            [
                'test_id' => $test->id,
                'student_id' => $student->id,
                'start_time' => $input['start_time'],
                'end_time' => $input['end_time'],
                'student_answers' => json_encode($student_answers),
                'value' => $total_score,
            ]
        )));
    }

    public function show(TestResult $result): JsonResponse
    {
        return response()->json(new TestResultResource($result));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TestResult $result
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(TestResult $result): JsonResponse
    {
        return response()->json($this->testResultRepository->deleteById($result->id));
    }
}
