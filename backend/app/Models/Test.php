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


    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
