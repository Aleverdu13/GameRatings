<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Game;

class CleanGameAboutPrefix extends Command
{
    protected $signature = 'games:clean-about';
    protected $description = 'Elimina los prefijos "About This Game" y "About This Content" del campo about de los juegos';

    public function handle()
    {
        $games = Game::where(function ($query) {
            $query->where('about', 'like', 'About This Game%')
                  ->orWhere('about', 'like', 'About This Content%');
        })->get();

        $count = 0;

        foreach ($games as $game) {
            // Quitar cualquiera de los dos prefijos al inicio del texto
            $cleaned = preg_replace('/^(About This Game|About This Content)\s*/', '', $game->about);

            if ($cleaned !== $game->about) {
                $game->about = trim($cleaned);
                $game->save();
                $this->info("✔️  Limpiado: {$game->name}");
                $count++;
            }
        }

        $this->info("✅ Proceso completado. Juegos actualizados: $count");
    }
}
