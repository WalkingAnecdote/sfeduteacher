<?php

namespace App\Repositories;


use App\Models\Question;

/**
 * Class CompanyEntityRepository.
 */
class QuestionRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Question::class;
    }
}
