<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class Graph extends Controller
{
    public function __invoke(Request $request)
    {
        $id = str()->random();

        $body = $request->validate([
            'equations' => 'required|array',
            'equations.*.value' => 'required|string',
            'equations.*.initialCondition' => 'required|numeric',
            'timeMax' => 'required|numeric',
        ], [], [
            'equations.*.value' => 'equation',
            'equations.*.initialCondition' => 'initial condition',
        ]);

        $WORKING_DIR = resource_path('python');

        $payload = json_encode([
            ...$body,
            'destination' => "public/{$id}.png",
        ]);

        $result = Process::path($WORKING_DIR)
            ->run("mkdir -p public && ./venv/bin/python3 graph.py '{$payload}'");

        // dd($result->output() . $result->errorOutput());

        if ($result->failed()) {
            posthog_event('graph_render_error', [
                ...$body,
                'error' => $result->errorOutput(),
            ]);

            return redirect()->back()->with('error', $result->errorOutput());
        }

        posthog_event('graph_rendered', [...$body]);

        return redirect()->back()->with('graph_id', $id);
    }
}
