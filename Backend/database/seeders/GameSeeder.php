<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('games')->insert([
            [
                'name' => 'Elden Ring',
                'score' => 9.5,
                'about' => 'Un épico RPG de mundo abierto.',
                'release_date' => '2022-02-25',
                'price' => 59.99,
                'screenshot' => json_encode(['elden1.jpg', 'elden2.jpg']),
                'videos' => json_encode(['elden_trailer.mp4']),
                'platforms' => json_encode(['PC', 'PS5', 'Xbox Series X']),
                'sys_req' => json_encode([
                    'windows' => [
                        'min' => ['CPU: i5', 'RAM: 8GB'],
                        'recomm' => ['CPU: i7', 'RAM: 16GB']
                    ],
                    'linux' => [
                        'min' => ['CPU: i5', 'RAM: 8GB'],
                        'recomm' => ['CPU: i7', 'RAM: 16GB']
                    ],
                ]),
                'tags' => json_encode(['RPG', 'Open World']),
                'lang' => json_encode(['EN', 'ES']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Stardew Valley',
                'score' => 8.9,
                'about' => 'Simulador de granja relajante.',
                'release_date' => '2016-02-26',
                'price' => 14.99,
                'screenshot' => json_encode(['stardew1.jpg']),
                'videos' => json_encode(['stardew_trailer.mp4']),
                'platforms' => json_encode(['PC', 'Switch']),
                'sys_req' => json_encode([
                    'windows' => [
                        'min' => ['CPU: Dual Core', 'RAM: 2GB'],
                        'recomm' => ['CPU: i3', 'RAM: 4GB']
                    ],
                    'linux' => [
                        'min' => ['CPU: Dual Core', 'RAM: 2GB'],
                        'recomm' => ['CPU: i3', 'RAM: 4GB']
                    ],
                ]),
                'tags' => json_encode(['Farming', 'Pixel Art']),
                'lang' => json_encode(['EN', 'ES', 'FR']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
