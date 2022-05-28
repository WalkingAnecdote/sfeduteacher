<?php

namespace App\Repositories;

use App\Models\Lesson;

/**
 * Class CompanyEntityRepository.
 */
class LessonRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Lesson::class;
    }
}
