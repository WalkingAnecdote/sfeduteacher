<?php

namespace App\Repositories;


use App\Models\TestResult;

/**
 * Class CompanyEntityRepository.
 */
class TestResultRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return TestResult::class;
    }
}
