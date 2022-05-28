<?php

namespace App\Repositories;

use App\Models\StudentProfile;
use App\Models\Subject;

/**
 * Class CompanyEntityRepository.
 */
class StudentRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return StudentProfile::class;
    }
}
