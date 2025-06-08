<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    
    // Ver todas las reviews de un juego
    public function index($gameId)
    {
        $reviews = Review::where('game_id', $gameId)->with('user')->get();

        return response()->json($reviews);
    }

    // Crear una nueva review
    public function store(Request $request, $gameId)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:100',
            'comment' => 'required|string|min:5'
        ]);

        // Comprobar si ya existe una review para este juego por parte del usuario
        $userId = Auth::id();

        $existing = Review::where('user_id', $userId)->where('game_id', $gameId)->first();
        if ($existing) {
            return response()->json(['message' => 'Ya has hecho una review para este juego.'], 409);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $review = Review::create([
            // 'title' => $validated['title'], // Lo comento porque de momento no van a tener título las reviews, si en un futuro las añado descomentar
            'comment' => $validated['comment'],
            'score' => $request->score,
            'date' => now(),
            'game_id' => $gameId,
            'user_id' => $user->id, // requiere login
            'user_name' => $user->name,
            'user_profile' => $user->profile_picture ?? 'assets/images/default-avatar.webp',
        ]);

        return response()->json([
            'message' => 'Review publicada',
            'review' => $review->load('user')
        ], 201);
        
    }
}
