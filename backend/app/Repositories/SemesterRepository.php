<?php

namespace App\Repositories;

use App\Models\Semester;

/**
 * Class CompanyEntityRepository.
 */
class SemesterRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Semester::class;
    }
}
