<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'group_id',
    ];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'semester_subject');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
