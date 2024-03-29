<?php

namespace App\Http\Requests\Test;

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
            "activity_id" => "sometimes|integer",
            "title" => "sometimes|string",
            "description" => "sometimes|string",
            'duration' => "sometimes|integer",
            'max_value' => "sometimes|integer",
        ];
    }
}
