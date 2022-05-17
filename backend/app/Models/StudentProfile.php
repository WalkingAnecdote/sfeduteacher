<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\StudentProfile
 *
 * @property int $id
 * @property int $group_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentProfile whereUpdatedAt($value)
 * @mixin Builder
 */
class StudentProfile extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->morphOne(User::class, 'profile');
    }
}
