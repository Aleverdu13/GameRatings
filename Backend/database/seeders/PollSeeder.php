<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PollSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear la encuesta
        $pollId = DB::table('polls')->insertGetId([
            'title' => '¿Cuál es tu género de videojuegos favorito?',
            'description' => 'Elige el tipo de juegos que más disfrutas.',
            'expires_at' => Carbon::now()->addDays(7),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Opciones para la encuesta
        $options = ['RPG', 'FPS', 'Plataformas', 'Estrategia', 'Carreras'];

        foreach ($options as $text) {
            DB::table('poll_options')->insert([
                'poll_id' => $pollId,
                'text' => $text,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
