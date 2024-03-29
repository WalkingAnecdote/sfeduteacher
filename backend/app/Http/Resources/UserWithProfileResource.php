<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserWithProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'approved' => $this->approved,
            'banned' => $this->banned,
            'roles' => $this->getRoleNames(),
            'created_at' => $this->created_at,
            'profile' => $this->profile,
        ];
    }
}
