<?php

namespace App\Http\Requests\Teacher;

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
            "user" => "sometimes|array",
            "user.first_name" =>  "sometimes|string",
            "user.last_name" =>  "sometimes|string",
            "user.middle_name" =>  "sometimes|string",
            "user.email" =>  "sometimes|email|unique:users,email",
            "user.password" =>  "sometimes|string",
            "profile" =>  "sometimes|array",
            "profile.rank" =>  "sometimes|string",
        ];
    }
}
