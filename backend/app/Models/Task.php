<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

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

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
