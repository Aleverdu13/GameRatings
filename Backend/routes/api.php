<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewVoteController;
use App\Http\Controllers\CommentVoteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\ModeratorController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});

// 🟢 Autenticación con Laravel Breeze (API)
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// 🟢 Rutas de la API
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/test', function () {
    return response()->json(['ok' => true]);
});


Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/games/{id}/reviews', [ReviewController::class, 'store']);
});
Route::get('/games/{id}/reviews', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->post('/reviews/{id}/comments', [CommentController::class, 'store']);
Route::get('/reviews/{id}/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->post('/reviews/{id}/vote', [ReviewVoteController::class, 'vote']);
Route::get('/reviews/{id}/votes', [ReviewVoteController::class, 'getVotes']);


Route::middleware('auth:sanctum')->post('/comments/{id}/vote', [CommentVoteController::class, 'vote']);
Route::get('/comments/{id}/votes', [CommentVoteController::class, 'getVotes']);

Route::middleware('auth:sanctum')->get('/profile', [UserController::class, 'profile']);

Route::middleware('auth:sanctum')->post('/profile/avatar', [UserController::class, 'uploadAvatar']);

Route::get('/polls', [PollController::class, 'index']);
Route::middleware('auth:sanctum')->post('/polls/vote/{pollOptionId}', [PollController::class, 'vote']);

Route::get('/polls/{id}/results', [PollController::class, 'results']);

Route::middleware('auth:sanctum')->post('/polls', [PollController::class, 'store']);

Route::middleware(['auth:sanctum', 'moderator'])->group(function () {
    Route::get('/moderator/reports', [ModeratorController::class, 'index']);
    Route::post('/moderator/reports/{id}/resolve', [ModeratorController::class, 'resolve']);
});
