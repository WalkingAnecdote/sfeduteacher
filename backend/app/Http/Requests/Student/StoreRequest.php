<?php

namespace App\Http\Requests\Student;

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
            "user" => "required|array",
            "user.first_name" =>  "required|string",
            "user.last_name" =>  "required|string",
            "user.middle_name" =>  "required|string",
            "user.email" =>  "required|email|unique:users,email",
            "user.password" =>  "required|string",
            "profile" =>  "required|array",
            "profile.group_id" =>  "required|integer",
        ];
    }
}
