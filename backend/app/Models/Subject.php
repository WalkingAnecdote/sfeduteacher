<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'teacher_id',
    ];

    public ?int $student_id = null;
    public ?int $semester_id = null;

    public function teacher()
    {
        return $this->belongsTo(TeacherProfile::class);
    }

    public function semester()
    {
        return $this->belongsToMany(Semester::class, 'semester_subject');
    }

    public function getTotalAvailableMarksAttribute(): int
    {
        $max_marks = 0;
        if ($this->semester_id) {
            $lessons = Lesson::where('subject_id', $this->id)->where('semester_id', $this->semester_id)->get();

            foreach ($lessons as $lesson) {

                foreach ($lesson->activities as $activity) {
                    $max_marks += $activity->max_mark;
                }
            }
        }
        return $max_marks;
    }

    public function getTotalStudentMarksAttribute(): int
    {
        $total_marks = 0;

        if ($this->semester_id and $this->student_id) {
            $lessons = Lesson::where('subject_id', $this->id)->where('semester_id', $this->semester_id)->get();
            foreach ($lessons as $lesson) {
                foreach ($lesson->activities as $activity) {
                    foreach ($activity->marks()->where('student_id', $this->student_id)->get() as $mark) {
                        $total_marks += $mark->value;
                    }
                }
            }
        }
        return $total_marks;
    }
}
