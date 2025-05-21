<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Game;

class UpdateGamesWithOpenCritic extends Command
{
    protected $signature = 'games:update-opencritic';
    protected $description = 'Completa datos de juegos con OpenCritic (score y plataformas) para 25 juegos al día';

    public function handle()
    {
        $headers = [
            'X-RapidAPI-Key' => env('OPENCRITIC_API_KEY'),
            'X-RapidAPI-Host' => 'opencritic-api.p.rapidapi.com',
        ];

        $games = Game::where('data_completed', false)
            ->orderByDesc('created_at')
            ->limit(25)
            ->get();

        $this->info("Procesando " . $games->count() . " juegos...");

        foreach ($games as $game) {
            $this->line("Buscando '{$game->name}'...");

            $searchRes = Http::withHeaders($headers)
                ->get('https://opencritic-api.p.rapidapi.com/game/search', [
                    'criteria' => $game->name
                ]);

            if ($searchRes->failed()) {
                $this->error("❌ Error en búsqueda para '{$game->name}': " . $searchRes->status());
                continue;
            }

            $searchResults = $searchRes->json();

            if (empty($searchResults)) {
                $this->warn("⚠️ No se encontró resultado para '{$game->name}'");
                continue;
            }

            $opencriticId = $searchResults[0]['id'];

            $detailsRes = Http::withHeaders($headers)
                ->get("https://opencritic-api.p.rapidapi.com/game/{$opencriticId}");

            if ($detailsRes->failed()) {
                $this->error("❌ Error al obtener detalles para ID $opencriticId ({$game->name})");
                continue;
            }

            $details = $detailsRes->json();

            // Extraer plataformas
            $platforms = [];
            if (isset($details['Platforms']) && is_array($details['Platforms'])) {
                $platforms = array_map(fn($p) => $p['name'], $details['Platforms']);
            }

            $score = $details['topCriticScore'] ?? null;

            // Guardar datos en la base de datos
            $game->update([
                'score' => $score,
                'platforms' => json_encode($platforms),
                'opencritic_id' => $opencriticId,
                'data_completed' => true,
            ]);

            $this->info("✅ Actualizado '{$game->name}' con ID $opencriticId (score: $score)");
        }

        $this->info("Proceso completado.");
    }
}
