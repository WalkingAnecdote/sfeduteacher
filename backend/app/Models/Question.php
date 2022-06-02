<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        "task_id",
        "text",
        "correct_answer_id",
        "value"
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function answers(): BelongsToMany
    {
        return $this->belongsToMany(Answer::class, 'question_answers');
    }

//    public function correct_answer(): BelongsTo
//    {
//        return $this->belongsTo(Answer::class, 'correct_answer_id');
//    }

}
