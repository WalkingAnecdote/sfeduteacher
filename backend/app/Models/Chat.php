<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chat extends Model
{

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, "chat_user");
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function getUnreadAttribute() {
        return $this->messages()->where("to_user_id", auth()->id())->where('viewed', 0)->count();
    }
}
