<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Game;

class TranslateGameAbout extends Command
{
    protected $signature = 'games:translate-about {--limit=20}';
    protected $description = 'Traduce el campo about al español y lo guarda en about_es';

    public function handle()
    {
        $limit = (int) $this->option('limit');
        $games = Game::whereNull('about_es')
            ->whereNotNull('about')
            ->where('about', '!=', '')
            ->limit($limit)
            ->get();

        if ($games->isEmpty()) {
            $this->info('No hay juegos para traducir.');
            return;
        }

        $texts = $games->pluck('about')->toArray();

        $response = Http::withHeaders([
            'x-rapidapi-key' => env('GAMES_API_KEY3'),
            'x-rapidapi-host' => 'openl-translate.p.rapidapi.com',
            'Content-Type' => 'application/json',
        ])->withBody(json_encode([
            'target_lang' => 'es',
            'text' => $texts,
        ]), 'application/json')->post('https://openl-translate.p.rapidapi.com/translate/bulk');

        $result = $response->json();
        $translations = $result['translatedTexts'] ?? null;

        if (!$translations || count($translations) !== count($games)) {
            $this->error('⚠️ Error en la respuesta de traducción.');
            dump($result);
            return;
        }

        foreach ($games as $index => $game) {
            $game->about_es = $translations[$index];
            $game->save();
        }

        $this->info('✅ Traducciones completadas.');
    }
}
