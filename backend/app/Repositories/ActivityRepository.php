<?php

namespace App\Repositories;

use App\Models\Activity;
use App\Models\Mark;

/**
 * Class CompanyEntityRepository.
 */
class ActivityRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Activity::class;
    }

    public function addMark($input) {
        return Mark::create($input);
    }
    public function updateMark($input) {
        $mark = Mark::where('activity_id', $input['activity_id'])->where('student_id', $input['student_id'])->first();
        $mark->update($input);
        return $mark->refresh();
    }
}
