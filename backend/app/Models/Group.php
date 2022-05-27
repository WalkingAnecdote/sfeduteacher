<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public const GROUP_TYPE_MASTER = 'master';
    public const GROUP_TYPE_BACHELOR = 'bachelor';

    protected $fillable = [
        'name',
        'type',
        'recruitment_date',
    ];

    protected $casts = [
        "recruitment_date" => "date"
    ];

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }

    public function students()
    {
        return $this->hasMany(StudentProfile::class);
    }
}
