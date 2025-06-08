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

    public function changeName(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        // Verificar si han pasado 14 días desde el último cambio
        if ($user->last_name_change && now()->diffInDays($user->last_name_change) < 14) {
            $remaining = 14 - now()->diffInDays($user->last_name_change);
            return response()->json([
                'message' => "Solo puedes cambiar tu nombre cada 14 días. Inténtalo en $remaining días."
            ], 403);
        }

        $user->name = $request->name;
        $user->last_name_change = now();
        $user->save();

        return response()->json([
            'message' => 'Nombre actualizado',
            'user' => $user
        ]);
    }
}
