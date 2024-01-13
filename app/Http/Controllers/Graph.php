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
            'equations.*.value' => 'required|string',
            'equations.*.initialCondition' => 'required|numeric',
            'timeMax' => 'required|numeric',
        ]);

        $equationReplacements = [
            'cos' => 'np.cos',
            'sin' => 'np.sin',
            'tan' => 'np.tan',
            'log' => 'np.log',
            '^' => '**',
            'e' => 'np.e',
            'pi' => 'np.pi',
        ];

        $equations = collect($body['equations'])
            ->pluck('value')
            ->map(function ($equation) use ($equationReplacements) {
                foreach($equationReplacements as $before => $after) {
                    $equation = str_replace($before, $after, $equation);
                }

                // Make implicit multiplication explicit.
                // Rule 1: digit followed by a letter (e.g., "4y" -> "4 * y")
                $equation = preg_replace('/(\d)([a-zA-Z])/', '$1 * $2', $equation);

                // Rule 2: closing parenthesis followed by a letter or digit (e.g., ")(4" -> ") * (4")
                $equation = preg_replace('/(\))(?=[a-zA-Z0-9])/', '$1 * ', $equation);

                // Rule 3: letter or digit followed by an opening parenthesis (e.g., "y(" -> "y * (")
                $equation = preg_replace('/([a-zA-Z0-9])(\()/', '$1 * $2', $equation);

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

        if($result->failed()) {
            return redirect()->back()->with('error', $result->errorOutput());
        }

        // dd($result->output() . $result->errorOutput());

        return redirect()->back()->with('graph_id', $id);
    }
}
