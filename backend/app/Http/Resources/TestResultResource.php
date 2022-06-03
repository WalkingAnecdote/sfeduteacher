<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class TestResultResource extends JsonResource
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
            'test_id' => $this->test_id,
            'test' => new TestResource($this->test),
            'student_id' => $this->student_id,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'student_answers' => new StudentAnswersResource(json_decode($this->student_answers)),
            'value' => $this->value,
        ];
    }
}
