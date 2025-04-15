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
            'title' => 'required|in:Recommended,Not recommended',
            'content' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $review = Review::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'date' => now(),
            'game_id' => $gameId,
            'user_id' => $user->id, // requiere login
        ]);

        return response()->json(['message' => 'Review publicada', 'review' => $review], 201);
    }
}
