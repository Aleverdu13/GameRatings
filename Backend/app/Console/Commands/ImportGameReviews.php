<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Game;
use App\Models\Review;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ImportGameReviews extends Command
{
    protected $signature = 'games:import-reviews {--limit=10}';
    protected $description = 'Importa reviews de los juegos desde API externa';

    public function handle()
    {
        $games = Game::where('reviews_imported', false)->get();
        $limit = (int) $this->option('limit');

        foreach ($games as $game) {
            $this->info(" Buscando reviews para: {$game->name}");

            // 1. Obtener los IDs de reviews
            $response = Http::withHeaders([
                'x-rapidapi-host' => 'games-details.p.rapidapi.com',
                'x-rapidapi-key' => env('GAMES_API_KEY3'),
            ])->get("https://games-details.p.rapidapi.com/reviews/mostrecent/{$game->id}?limit=$limit&offset=0");

            if (!$response->ok()) {
                $this->error("❌ Error al obtener reviews para {$game->name}");
                $this->warn("Código de estado: " . $response->status());
                $this->warn("Respuesta: " . $response->body());
                continue;
            }

            $reviews = $response->json('data.reviews') ?? [];
            $imported = 0;

            foreach ($reviews as $rev) {
                $reviewId = $rev['review_id'];

                // 2. Obtener detalles de la review
                $detailResponse = Http::withHeaders([
                    'x-rapidapi-host' => 'games-details.p.rapidapi.com',
                    'x-rapidapi-key' => env('GAMES_API_KEY3'),
                ])->get("https://games-details.p.rapidapi.com/reviews/{$reviewId}");

                if (!$detailResponse->ok()) {
                    $this->warn("⚠️ No se pudo obtener detalle de review {$reviewId}");
                    continue;
                }

                $data = $detailResponse->json('data');

                if (empty($data['content'])) {
                    $this->warn("⏭ Review sin contenido de {$data['user_name']} omitida.");
                    continue;
                }

                $helpfulRaw = $data['rating']['helpful'] ?? '0';
                $funnyRaw = $data['rating']['funny'] ?? '0';

                $helpful = is_numeric($helpfulRaw)
                    ? (int) $helpfulRaw
                    : (preg_match('/\d+/', $helpfulRaw, $matches) ? (int) $matches[0] : 0);

                $funny = is_numeric($funnyRaw)
                    ? (int) $funnyRaw
                    : (preg_match('/\d+/', $funnyRaw, $matches) ? (int) $matches[0] : 0);


                // 3. Limpiar foto de perfil
                $userProfile = $data['user_profile'] ?? '';
                $userProfile = explode('🔍', $userProfile)[0];

                // 4. Guardar en la base de datos
                Review::create([
                    'game_id'      => $game->id,
                    'user_id'      => null,
                    'comment'      => $data['content'] ?? '',
                    'date'         => isset($data['date']['posted']) ? Carbon::parse($data['date']['posted']) : now(),
                    'score'        => 0,
                    'base_score'   => $helpful + $funny,
                    'user_name'    => $data['user_name'] ?? 'Anónimo',
                    'user_profile' => $userProfile,
                ]);

                $imported++;
                $this->info("✅ Review importada de {$data['user_name']}");
            }
            if ($imported > 0) {
                $game->reviews_imported = true;
                $game->save();
            }
        }

        $this->info("✅ Importación de reviews finalizada.");
    }
}
