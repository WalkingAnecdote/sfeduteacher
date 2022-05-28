<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            "date" => "sometimes|date",
            "theme" => "sometimes|string",
            "type" => "sometimes|in:lecture,practice",
            "teacher_id" => "sometimes|integer",
            "semester_id" => "sometimes|integer",
            "subject_id" => "sometimes|integer",
        ];
    }
}
