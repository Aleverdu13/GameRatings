<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poll;
use Illuminate\Http\JsonResponse;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PollController extends Controller
{

    public function index(): JsonResponse
    {
        $polls = Poll::with(['options.votes'])->get();

        // Añadir recuento de votos y porcentaje
        $polls = $polls->map(function ($poll) {
            $totalVotes = $poll->options->sum(fn($opt) => $opt->votes->count());

            $poll->total_votes = $totalVotes;

            $poll->options = $poll->options->map(function ($option) use ($totalVotes) {
                $votesCount = $option->votes->count();
                $option->votes_count = $votesCount;
                $option->percentage = $totalVotes > 0 ? round(($votesCount / $totalVotes) * 100) : 0;
                return $option;
            });

            return $poll;
        });

        return response()->json($polls);
    }


    public function vote(Request $request, $pollOptionId): JsonResponse
    {
        $request->validate([
            'poll_id' => 'required|exists:polls,id',
        ]);

        $user = Auth::user();

        // Evitar doble voto
        $alreadyVoted = PollVote::where('poll_id', $request->poll_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyVoted) {
            return response()->json(['message' => 'Ya has votado en esta encuesta'], 403);
        }

        PollVote::create([
            'poll_option_id' => $pollOptionId,
            'poll_id' => $request->poll_id,
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Voto registrado']);
    }

    public function results($pollId): JsonResponse
    {
        $poll = Poll::with(['options.votes'])->findOrFail($pollId);

        $results = $poll->options->map(function ($option) {
            return [
                'option' => $option->text,
                'votes' => $option->votes->count()
            ];
        });

        return response()->json([
            'poll' => $poll->title,
            'results' => $results
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'No tienes permisos para crear encuestas'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'expires_at' => 'nullable|date',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $poll = Poll::create([
                'title' => $request->title,
                'description' => $request->description,
                'expires_at' => $request->expires_at,
            ]);

            foreach ($request->options as $option) {
                PollOption::create([
                    'poll_id' => $poll->id,
                    'text' => $option,
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Encuesta creada', 'poll' => $poll->load('options')], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear la encuesta'], 500);
        }
    }
}
