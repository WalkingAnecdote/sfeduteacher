<?php

namespace App\Http\Requests\Task;

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
            "test_id" => "sometimes|integer",
            "text" => "sometimes|string",
            "value" => "sometimes|integer",
            "correct_answer_id" => "sometimes|integer",
            "type" => "sometimes|string|in:quiz,mono",
        ];
    }
}
