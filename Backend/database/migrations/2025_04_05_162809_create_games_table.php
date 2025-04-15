<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id(); // id autoincremental
            $table->string('name'); // nombre del juego
            $table->float('score')->nullable(); // puntuación (opcional al principio)
            $table->text('about')->nullable(); // descripción larga
            $table->date('release_date')->nullable(); // fecha de salida
            $table->decimal('price', 8, 2)->nullable(); // precio con decimales

            // Campos tipo JSON
            $table->json('screenshot')->nullable(); // lista de imágenes
            $table->json('videos')->nullable();     // lista de videos
            $table->json('platforms')->nullable();  // lista de plataformas
            $table->json('sys_req')->nullable();    // requisitos mínimos y recomendados
            $table->json('tags')->nullable();       // etiquetas del juego
            $table->json('lang')->nullable();       // idiomas disponibles

            $table->timestamps(); // created_at y updated_at
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
