<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Game;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImportGamesFromApi extends Command
{
    protected $signature = 'games:import {--pages=1}';
    protected $description = 'Importar juegos desde la API Games Details';

    public function handle()
    {
        $headers = [
            'X-RapidAPI-Key' => env('GAMES_API_KEY'),
            'X-RapidAPI-Host' => 'games-details.p.rapidapi.com',
        ];

        $pagesToImport = (int) $this->option('pages');

        for ($page = 21; $page <= $pagesToImport; $page++) {
            $this->info("Importando página $page...");
            $response = Http::withHeaders($headers)->get("https://games-details.p.rapidapi.com/page/$page");

            if ($response->failed()) {
                $this->error("Error al obtener la página $page");
                continue;
            }

            $games = $response->json()['data']['pages'] ?? [];

            foreach ($games as $basicGame) {
                $apiId = $basicGame['id'];

                // Comprobar si ya existe
                if (Game::where('id', $apiId)->exists()) {
                    $this->warn("Juego ya existente: {$basicGame['name']} (ID: $apiId)");
                    continue;
                }

                // Obtener detalles del juego
                $detailsRes = Http::withHeaders($headers)->get("https://games-details.p.rapidapi.com/gameinfo/single_game/{$apiId}");

                //Obtener videos del juego
                $videosRes = Http::withHeaders($headers)->get("https://games-details.p.rapidapi.com/media/videos/{$apiId}?limit=8&offset=0'");

                if ($detailsRes->failed()) {
                    $this->error("Error al obtener detalles del juego ID $apiId");
                    continue;
                }

                $details = $detailsRes->json()['data'] ?? [];

                $videos = $videosRes->json()['data'] ?? [];

                try {

                    // Comprobar si el juego tiene un nombre para arreglar error que no me deja importar
                    if (!isset($details['name'])) {
                        $this->error("Falta el campo 'name' para el juego ID $apiId. Contenido devuelto:");
                        $this->line(json_encode($details, JSON_PRETTY_PRINT));
                        continue;
                    }

                    Game::create([
                        'id' => $apiId,
                        'name' => $details['name'],
                        'about' => $details['about_game'] ?? null,
                        'release_date' => $this->formatDate($details['release_date'] ?? null),
                        'price' => $this->parsePrice($details['pricing'][0]['price'] ?? $basicGame['price'] ?? null),
                        'screenshot' => json_encode(
                            array_merge(
                                [$basicGame['img']], // La portada de la API básica
                                $details['media']['screenshot'] ?? [] // El resto de imágenes
                            )
                        ),
                        'videos' => json_encode($videos ?? []),
                        'platforms' => null,
                        'score' => null,
                        'sys_req' => json_encode($details['sys_req'] ?? []),
                        'tags' => json_encode($details['tags'] ?? []),
                        'lang' => json_encode($details['lang'] ?? []),
                        'opencritic_id' => null,
                        'data_completed' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $this->info("Juego importado: {$details['name']}");
                } catch (\Exception $e) {
                    $this->error("Error al guardar juego ID $apiId: " . $e->getMessage());
                }
            }
        }

        $this->info("Importación completada.");
    }

    private function formatDate($date)
    {
        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function parsePrice($price)
    {
        if (!$price || Str::contains(strtolower($price), 'free')) return 0.00;

        // Filtrar símbolos no numéricos
        $price = preg_replace('/[^0-9.,]/', '', $price);
        $price = str_replace(',', '.', $price);
        return floatval($price);
    }
}
