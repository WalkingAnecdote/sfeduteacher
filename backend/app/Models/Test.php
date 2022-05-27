<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $fillable = [
        "activity_id",
        "title",
        "description",
        'duration',
        'max_value'
    ];

    //questions (List<question_id>)
    //tasks (List<task_id>)
}
