<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class Graph extends Controller
{
    public function __invoke(Request $request)
    {
        $START = hrtime(as_number: true);
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

        $payload = [
            ...$body,
            'destination' => "public/{$id}.png",
        ];

        foreach ($payload['equations'] as &$equation) {
            // Replacements for common inputs that sympy can't handle.
            $equation['value'] = str_replace('pit', 'pi t', $equation['value']);
            $equation['value'] = str_replace('piy', 'pi y', $equation['value']);
        }

        $encodedPayload = json_encode($payload);
        $result = Process::path($WORKING_DIR)
            ->run("./venv/bin/python3 graph.py '{$encodedPayload}'");

        // dd($result->output() . $result->errorOutput());

        if ($result->failed()) {
            posthog_event('graph_render_error', [
                ...$body,
                'error' => $result->errorOutput(),
                'time_elapsed' => round((hrtime(as_number: true) - $START) / 1e6),
                'type' => '1d',
            ]);

            return redirect()->back()->with('error', $result->errorOutput());
        }

        posthog_event('graph_rendered', [
            ...$body,
            'time_elapsed' => round((hrtime(as_number: true) - $START) / 1e6),
            'type' => '1d',
        ]);

        return redirect()->back()->with('graph_id', $id);
    }
}
