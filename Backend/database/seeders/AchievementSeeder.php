<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('achievements')->insert([
            [
                'name' => 'Primer comentario',
                'description' => 'Has escrito tu primer comentario en una review.',
                'icon' => 'icons/comment1.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '5 votos positivos',
                'description' => 'Una de tus reviews ha recibido 5 votos positivos.',
                'icon' => 'icons/upvotes5.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '100 juegos valorados',
                'description' => 'Has votado 100 juegos diferentes.',
                'icon' => 'icons/100votes.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Encuestador activo',
                'description' => 'Has participado en al menos 5 encuestas.',
                'icon' => 'icons/polling.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Logro oculto',
                'description' => 'Este logro se descubre al usar una función secreta.',
                'icon' => 'icons/hidden.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

}
