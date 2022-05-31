<?php

namespace App\Repositories;


use App\Models\Message;

/**
 * Class CompanyEntityRepository.
 */
class MessageRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Message::class;
    }
}
