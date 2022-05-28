<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
            "date" => "sometimes|date_format:Y-m-d H:i:s",
            "theme" => "required|string",
            "type" => "required|in:lecture,practice",
            "teacher_id" => "sometimes|integer",
            "semester_id" => "required|integer",
            "subject_id" => "required|integer",
        ];
    }
}
