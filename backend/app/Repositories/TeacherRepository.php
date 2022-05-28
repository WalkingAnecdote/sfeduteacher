<?php

namespace App\Repositories;

use App\Models\TeacherProfile;

/**
 * Class CompanyEntityRepository.
 */
class TeacherRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return TeacherProfile::class;
    }
}
