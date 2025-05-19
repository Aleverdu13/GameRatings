<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Services\AchievementService;

class CommentController extends Controller
{
    public function store(Request $request, $reviewId): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);


        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $review = Review::findOrFail($reviewId);

        $comment = Comment::create([
            'content' => $validated['content'],
            'review_id' => $review->id,
            'user_id' => $user->id,
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comentario publicado',
            'comment' => $comment->toArray()
        ], 201);
    }

    public function index($reviewId)
    {
        return Comment::with('user')
            ->where('review_id', $reviewId)
            ->whereNull('parent_id')
            -> latest() // Tengo que sustituirlo por el vote count yna vez que implemente el sistema de votos
            //->orderByDesc('vote_count')
            ->paginate(5);
    }
}
