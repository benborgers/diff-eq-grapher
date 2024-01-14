<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use PostHog\PostHog;

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

        $disallowedWordsInEquations = ['print', 'while', 'for', 'open', 'import'];

        foreach ($body['equations'] as $i => $equation) {
            foreach ($disallowedWordsInEquations as $disallowedWord) {
                if (str_contains($equation['value'], $disallowedWord)) {
                    // Validation error
                    return redirect()->back()->withErrors([
                        "equations.$i.value" => 'Invalid equation.',
                    ]);
                }
            }
        }

        // e.g. sin^2(x)
        $canBeRaised = ['sin', 'cos', 'tan'];

        // DO NOT USE t, y, e (already are variables)
        $humanToToken = [
            'cos' => 'c',
            'sin' => 's',
            'tan' => 'a', // not t
            'log' => 'l',
            'pi' => 'p',
            'π' => 'p',
        ];

        $tokenToComputer = [
            'p' => 'np.pi',
            's' => 'np.sin',
            'c' => 'np.cos',
            'a' => 'np.tan',
            'l' => 'np.log',
            '^' => '**',
            'e' => 'np.e',
        ];

        $functions = ['np.sin', 'np.cos', 'np.tan', 'np.log'];

        $equations = collect($body['equations'])
            ->pluck('value')
            ->map(function ($equation) use ($canBeRaised, $humanToToken, $tokenToComputer, $functions) {
                // Replace sin^2(y) with sin(y)**2
                foreach ($canBeRaised as $function) {
                    $equation = preg_replace("/({$function})\^(\d+)\((.+)\)/", '$1($3)**$2', $equation);
                }

                foreach ($humanToToken as $before => $after) {
                    $equation = str_replace($before, $after, $equation);
                }

                // Make implicit multiplication explicit.
                // Digit followed by a letter (e.g., "4y" -> "4 * y")
                $equation = preg_replace('/(\d)\s*([a-z])/', '$1 * $2', $equation);
                // Closing parenthesis followed by a letter or digit (e.g., ")(4" -> ") * (4")
                $equation = preg_replace('/(\))\s*(?=[a-z0-9])/', '$1 * ', $equation);
                // Letter or digit followed by an opening parenthesis (e.g., "y(" -> "y * (")
                $equation = preg_replace('/([a-z0-9])\s*(\()/', '$1 * $2', $equation);
                // Two variables (e.g., "yx" -> "y * x" or "y x" -> "y * x")
                $equation = preg_replace('/([a-z])\s*([a-z])/', '$1 * $2', $equation);
                // Two parentheses (e.g., ")(" -> ") * (")
                $equation = preg_replace('/(\))\s*(\()/', '$1 * $2', $equation);

                foreach ($tokenToComputer as $before => $after) {
                    $equation = str_replace($before, $after, $equation);
                }

                // Remove * after functions (e.g. "np.sin * (x)" -> "np.sin(x)")
                foreach ($functions as $function) {
                    $equation = preg_replace("/({$function})\s*\*/", '$1', $equation);
                }

                return $equation;
            });

        $pythonFunctions = $equations->map(function ($equation, $i) {
            return <<<PYTHON
            def eq$i(y, t):
                return $equation
            PYTHON;
        })->join("\n\n");

        $pythonInitialConditions = collect($body['equations'])
            ->pluck('initialCondition')
            ->map(function ($initialCondition, $i) {
                return "y0_$i = $initialCondition";
            })->join("\n");

        $pythonSolves = $equations->map(function ($equation, $i) {
            return "y$i = odeint(eq$i, y0_$i, t)";
        })->join("\n");

        $pythonPlots = $equations->map(function ($equation, $i) use ($body) {
            $originalEquation = $body['equations'][$i]['value'];

            return "plt.plot(t, y$i, label='dy/dt = $originalEquation')";
        })->join("\n");

        $python = <<<PYTHON
        import numpy as np
        from scipy.integrate import odeint
        import matplotlib.pyplot as plt

        # Define multiple differential equations
        {$pythonFunctions}

        # Initial conditions
        {$pythonInitialConditions}

        # Time vector from 0 to something
        t = np.linspace(0, {$body['timeMax']}, 400)

        # Solve the differential equations
        {$pythonSolves}

        # Plot the solutions
        {$pythonPlots}

        # Add legends and labels
        plt.xlabel('Time')
        plt.ylabel('y(t)')
        plt.legend()

        # Save the plot to a file in the filesystem
        plt.savefig('{$id}.png', dpi=300)
        PYTHON;

        $WORKING_DIR = resource_path('python');

        file_put_contents("{$WORKING_DIR}/{$id}.py", $python);

        $result = Process::path($WORKING_DIR)
            ->run("source venv/bin/activate && python3 {$id}.py");

        Process::path($WORKING_DIR)->run("rm {$id}.py");

        if ($result->failed()) {
            PostHog::capture([
                'distinctId' => session()->getId(),
                'event' => 'graph_render_error',
                'properties' => [
                    'error' => $result->errorOutput(),
                ],
            ]);

            return redirect()->back()->with('error', $result->errorOutput());
        }

        // dd($result->output() . $result->errorOutput());

        PostHog::capture([
            'distinctId' => session()->getId(),
            'event' => 'graph_rendered',
            'properties' => [
                ...$body
            ]
        ]);

        return redirect()->back()->with('graph_id', $id);
    }
}
