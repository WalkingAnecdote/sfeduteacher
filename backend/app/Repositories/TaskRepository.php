<?php

namespace App\Repositories;


use App\Models\Task;

/**
 * Class CompanyEntityRepository.
 */
class TaskRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Task::class;
    }
}
