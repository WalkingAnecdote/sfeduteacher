<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        "chat_id",
        "from_user_id",
        "to_user_id",
        "message",
        "viewed"
    ];

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    public function from_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "from_user_id");
    }

    public function to_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "to_user_id");
    }
}
