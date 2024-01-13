<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class Graph extends Controller
{
    public function __invoke(Request $request)
    {
        $id = str()->random();

        $python = <<<PYTHON
import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

# Define multiple differential equations
def dydt1(y, t):
    return -2 * y + 2

def dydt2(y, t):
    return -y + 1

# Initial conditions
y0_1 = 0.5
y0_2 = 1.0

# Time vector from 0 to 5
t = np.linspace(0, 10, 100)

# Solve the differential equations
y1 = odeint(dydt1, y0_1, t)
y2 = odeint(dydt2, y0_2, t)

# Plot the solutions
plt.plot(t, y1, label='dy/dt = -2y + 2, y(0) = 0.5')
plt.plot(t, y2, label='dy/dt = -y + 1, y(0) = 1.0')

# Add legends and labels
plt.xlabel('Time')
plt.ylabel('y(t)')
plt.legend()

# Save the plot to a file in the filesystem
plt.savefig('{$id}.png')
PYTHON;

        $WORKING_DIR = resource_path('python');

        file_put_contents("{$WORKING_DIR}/{$id}.py", $python);

        $result = Process::path($WORKING_DIR)
            ->run("source venv/bin/activate && python3 {$id}.py");

        Process::path($WORKING_DIR)->run("rm {$id}.py");

        // dd($result->output() . $result->errorOutput());
    }
}
