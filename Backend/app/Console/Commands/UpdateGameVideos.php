<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Game;

class UpdateGameVideos extends Command
{
    protected $signature = 'games:update-videos';
    protected $description = 'Actualiza los vídeos de cada juego usando el endpoint de media/videos';

    public function handle()
    {
        $headers = [
            'X-RapidAPI-Key' => env('GAMES_API_KEY2'),
            'X-RapidAPI-Host' => 'games-details.p.rapidapi.com',
        ];

        $games = Game::all();
        $this->info("Actualizando vídeos de " . $games->count() . " juegos...");

        foreach ($games as $game) {
            $this->line("Obteniendo vídeos del juego ID {$game->id}...");

            $res = Http::withHeaders($headers)->get("https://games-details.p.rapidapi.com/media/videos/{$game->id}", [
                'limit' => 10,
                'offset' => 0,
            ]);

            if ($res->failed()) {
                $this->error("❌ Error al obtener vídeos para ID {$game->id}");
                continue;
            }

            $data = $res->json();

            $videos = $data['data']['videos'] ?? [];

            if (!is_array($videos)) {
                $this->warn("⚠️ Formato inesperado de vídeos para ID {$game->id}");
                continue;
            }

            $game->update([
                'videos' => json_encode($videos)
            ]);

            $this->info("✅ Vídeos actualizados para '{$game->name}'");
        }

        $this->info("Proceso finalizado.");
    }
}
