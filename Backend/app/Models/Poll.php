<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    protected $fillable = ['title', 'description', 'expires_at'];

    public function options()
    {
        return $this->hasMany(PollOption::class);
    }
}
