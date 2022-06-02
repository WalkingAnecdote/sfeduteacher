<?php

namespace App\Http\Requests\Task;

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
            "test_id" => "required|integer",
            "text" => "required|string",
            "value" => "required|integer",
            "correct_answer_id" => "sometimes|integer",
            "type" => "required|string|in:quiz,mono",
        ];
    }
}
