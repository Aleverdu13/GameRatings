<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // Obtener todos los juegos
    public function index()
    {
        return response()->json(Game::all());
    }

    // Obtener un juego por su ID
    public function show($id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json(['message' => 'Juego no encontrado'], 404);
        }

        return response()->json($game);
    }
}
