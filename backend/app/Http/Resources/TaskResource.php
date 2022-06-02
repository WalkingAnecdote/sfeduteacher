<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            "test_id" => $this->test_id,
            "text" => $this->text,
            "value" => $this->value,
            "correct_answer_id" => $this->correct_answer_id,
            "type" => $this->type,
            "correct_answer" => new AnswerResource($this->correct_answer),
            "question" => new QuestionResource($this->question),
        ];
    }
}
