<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ActivityWithMarksResource extends JsonResource
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
            "description" => $this->description,
            "max_mark" => $this->max_mark,
            "lesson_id" => $this->lesson_id,
            "marks" => (new MarksResource($this->marks)),
        ];
    }
}
