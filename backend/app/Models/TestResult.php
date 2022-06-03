<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        "test_id",
        "student_id",
        "start_time",
        "end_time",
        "student_answers",
        "value"
    ];

    protected $casts = [
        'start_time' => "datetime",
        'end_time' => "datetime",
        'student_answers' => "array",
    ];

    public function student() {
        return $this->belongsTo(StudentProfile::class, "student_id");
    }

    public function test() {
        return $this->belongsTo(Test::class, "test_id");
    }
}
