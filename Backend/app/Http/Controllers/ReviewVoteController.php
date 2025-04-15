<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\ReviewVote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewVoteController extends Controller
{
    public function vote(Request $request, $reviewId): JsonResponse
    {
        $request->validate([
            'vote' => 'required|in:1,-1', // 1 = upvote, -1 = downvote
        ]);

        $user = Auth::user();
        $review = Review::findOrFail($reviewId);

        $existingVote = ReviewVote::where('review_id', $review->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingVote) {
            if ($existingVote->vote == $request->vote) {
                $existingVote->delete(); // eliminar si repite el voto
                return response()->json(['message' => 'Voto eliminado']);
            } else {
                $existingVote->update(['vote' => $request->vote]);
                return response()->json(['message' => 'Voto actualizado']);
            }
        } else {
            ReviewVote::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
                'vote' => $request->vote,
            ]);
            return response()->json(['message' => 'Voto registrado']);
        }
    }

    public function getVotes($reviewId): JsonResponse
    {
        $upvotes = \App\Models\ReviewVote::where('review_id', $reviewId)->where('vote', 1)->count();
        $downvotes = \App\Models\ReviewVote::where('review_id', $reviewId)->where('vote', -1)->count();

        return response()->json([
            'upvotes' => $upvotes,
            'downvotes' => $downvotes,
            'total' => $upvotes - $downvotes,
        ]);
    }
}
