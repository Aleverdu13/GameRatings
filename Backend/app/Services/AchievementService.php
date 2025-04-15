<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;

class AchievementService
{
    public static function giveTo(User $user, string $achievementName): void
    {
        $achievement = Achievement::where('name', $achievementName)->first();

        if (!$achievement) return;

        // Verifica si ya lo tiene
        if ($user->achievements()->where('achievement_id', $achievement->id)->exists()) {
            return;
        }

        // Lo otorga
        $user->achievements()->attach($achievement->id, ['awarded_at' => now()]);
    }
}
