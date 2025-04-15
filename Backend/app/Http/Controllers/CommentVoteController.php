<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class CommentVoteController extends Controller
{
    public function vote(Request $request, $commentId): JsonResponse
    {
        $request->validate([
            'vote' => 'required|in:1,-1',
        ]);

        $user = Auth::user();
        $comment = Comment::findOrFail($commentId);

        $existingVote = CommentVote::where('comment_id', $comment->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingVote) {
            if ($existingVote->vote == $request->vote) {
                $existingVote->delete();
                return response()->json(['message' => 'Voto eliminado']);
            } else {
                $existingVote->update(['vote' => $request->vote]);
                return response()->json(['message' => 'Voto actualizado']);
            }
        } else {
            CommentVote::create([
                'comment_id' => $comment->id,
                'user_id' => $user->id,
                'vote' => $request->vote,
            ]);
            return response()->json(['message' => 'Voto registrado']);
        }
    }

    public function getVotes($commentId): JsonResponse
    {
        $upvotes = CommentVote::where('comment_id', $commentId)->where('vote', 1)->count();
        $downvotes = CommentVote::where('comment_id', $commentId)->where('vote', -1)->count();

        return response()->json([
            'upvotes' => $upvotes,
            'downvotes' => $downvotes,
            'total' => $upvotes - $downvotes,
        ]);
    }

}
