<?php

namespace App\Repositories;


use App\Models\Group;

/**
 * Class CompanyEntityRepository.
 */
class GroupRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Group::class;
    }
}
