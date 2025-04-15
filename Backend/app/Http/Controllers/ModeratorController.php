<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;

class ModeratorController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reportable', 'user'])->where('status', 'pendiente')->get();
        return response()->json($reports);
    }

    public function resolve($id)
    {
        $report = Report::findOrFail($id);
        $report->status = 'revisado';
        $report->moderator_id = Auth::id();
        $report->save();

        return response()->json(['message' => 'Reporte marcado como revisado']);
    }
}
