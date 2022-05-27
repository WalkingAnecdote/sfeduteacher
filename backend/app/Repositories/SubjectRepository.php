<?php

namespace App\Repositories;

use App\Models\Subject;

/**
 * Class CompanyEntityRepository.
 */
class SubjectRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Subject::class;
    }
}
