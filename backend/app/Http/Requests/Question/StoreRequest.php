<?php

namespace App\Http\Requests\Question;

use App\Http\Resources\AnswersResource;
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
            "task_id" => "required|integer",
//            "correct_answer_id" => "sometimes|integer",
            "text" => "required|string",
        ];
    }
}
