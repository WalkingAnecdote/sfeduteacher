<?php

namespace App\Repositories;

use App\Models\User;

/**
 * Class CompanyEntityRepository.
 */
class UserRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return User::class;
    }

    public function create(array $data)
    {
        $this->unsetClauses();

        return $this->model->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'middle_name' => $data['middle_name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
}
