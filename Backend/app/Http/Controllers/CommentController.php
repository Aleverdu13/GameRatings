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
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $review = Review::findOrFail($reviewId);

        $comment = Comment::create([
            'content' => $request->content,
            'review_id' => $review->id,
            'user_id' => $user->id,
        ]);

        AchievementService::giveTo($user, 'Primer comentario');

        return response()->json([
            'message' => 'Comentario publicado',
            'comment' => $comment
        ], 201);
    }

    public function index($reviewId)
    {
        $comments = Comment::where('review_id', $reviewId)->with('user')->get();

        return response()->json($comments);
    }
}
