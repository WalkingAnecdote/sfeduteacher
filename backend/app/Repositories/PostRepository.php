<?php

namespace App\Repositories;


use App\Models\Post;

/**
 * Class CompanyEntityRepository.
 */
class PostRepository extends BaseRepository
{
    /**
     * @return string
     *  Return the model
     */
    public function model()
    {
        return Post::class;
    }
}
