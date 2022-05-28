<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class LessonResource extends JsonResource
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
            'date' => $this->date,
            'theme' => $this->theme,
            'type' => $this->type,
            "semester_id"  => $this->semester_id,
            "subject_id"  => $this->subject_id,
            'teacher' => (new TeacherProfileResource($this->teacher)),
        ];
    }
}
