<?php

namespace App\Repositories;


use App\Models\Answer;

/**
 * Class CompanyEntityRepository.
 */
class AnswerRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Answer::class;
    }
}
