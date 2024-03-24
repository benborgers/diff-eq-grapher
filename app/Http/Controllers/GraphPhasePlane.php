<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class GraphPhasePlane extends Controller
{
    public function __invoke(Request $request)
    {
        $START = hrtime(as_number: true);
        $id = str()->random();

        $body = $request->validate([
            'equation1' => 'required|string',
            'equation2' => 'required|string',
            'xMin' => 'required|numeric',
            'xMax' => 'required|numeric',
            'yMin' => 'required|numeric',
            'yMax' => 'required|numeric',
            'points' => 'present|array',
        ]);

        $WORKING_DIR = resource_path('python');

        $payload = [
            ...$body,
            'destination' => "public/{$id}.png",
            'xt_destination' => "public/{$id}_1.png",
        ];

        $encodedPayload = json_encode($payload);

        $result = Process::path($WORKING_DIR)
            ->run("./venv/bin/python3 phase-plane.py '{$encodedPayload}'");

        if ($result->failed()) {
            posthog_event('graph_render_error', [
                ...$body,
                'error' => $result->errorOutput(),
                'time_elapsed' => round((hrtime(as_number: true) - $START) / 1e6),
                'type' => '2d',
            ]);

            return redirect()->back()->with('error', $result->errorOutput());
        }

        posthog_event('graph_rendered', [
            ...$body,
            'time_elapsed' => round((hrtime(as_number: true) - $START) / 1e6),
            'type' => '2d',
        ]);

        return redirect()->back()->with('graph_id', $id);
    }
}
