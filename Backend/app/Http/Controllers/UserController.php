<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{

public function profile(): JsonResponse
    {
        $user = User::with([
            'reviews.game',
            'comments.review',
            'achievements'
        ])->find(Auth::id());

        return response()->json([
            'user' => $user
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|max:2048' // Máximo 2MB
        ]);
        
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $path = $request->file('avatar')->store('avatars', 'public');

        // Opcional: eliminar avatar anterior si existe
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Avatar actualizado correctamente',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }
}
