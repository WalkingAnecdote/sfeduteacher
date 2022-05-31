<?php

namespace App\Repositories;


use App\Models\Test;

/**
 * Class CompanyEntityRepository.
 */
class TestRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Test::class;
    }
}
