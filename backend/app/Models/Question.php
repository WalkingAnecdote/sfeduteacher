<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        "test_id",
        "text",
        "value"
    ];

    //answers (List<answer_id>)
    //correct_answers (List<answer_id>)
}
