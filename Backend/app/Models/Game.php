<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'id',
        'name',
        'score',
        'about',
        "about_es",
        'release_date',
        'price',
        'screenshot',
        'videos',
        'platforms',
        'sys_req',
        'tags',
        'lang',
        'opencritic_id',
        'data_completed',
        'reviews_imported',
    ];


    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
