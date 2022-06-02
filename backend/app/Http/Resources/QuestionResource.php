<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            "task_id" => $this->task_id,
            "text" => $this->text,
            "answers" => new AnswersResource($this->answers),
//            "correct_answer" => new AnswerResource($this->correct_answer)
        ];
    }
}
