<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        "date",
        "theme",
        "type",
        "teacher_id",
        "semester_id",
        "subject_id"
    ];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function teacher()
    {
        return $this->belongsTo(TeacherProfile::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
