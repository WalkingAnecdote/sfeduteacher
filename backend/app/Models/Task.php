<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Task extends Model
{
    use HasFactory;

    public const QUIZ_TYPE = "quiz";
    public const MONO_TYPE = "mono";

    protected $fillable = [
        "test_id",
        "text",
        "value",
        "correct_answer_id",
        "type", //quiz, mono
    ];

    public function correct_answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'correct_answer_id');
    }

    public function question(): HasOne
    {
        return $this->hasOne(Question::class, "task_id");
    }
}
