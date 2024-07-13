import { useState, Fragment, useEffect } from "react";
import InputBoxy from "./components/form/input-boxy";
import * as Form from "@radix-ui/react-form";
import Button from "./components/form/button";
import usePython from "./hooks/usePython";

type Equation = {
  equation: string;
  initialCondition: string;
};

const EMPTY_EQUATION: Equation = {
  equation: "",
  initialCondition: "",
};

export default function App() {
  const { renderTargetRef, execute, ready } = usePython();

  const [bootedUp, setBootedUp] = useState(false);
  const [equations, setEquations] = useState<Equation[]>([
    {
      equation: "y * (y-1)(1-y/10) - 0.1t",
      initialCondition: "10",
    },
  ]);
  const [timeMax, setTimeMax] = useState<string>("150");

  useEffect(() => {
    if (!ready) {
      return;
    }

    execute(`
      import json
      from sympy import symbols, lambdify, E, pi
      from sympy.parsing.sympy_parser import parse_expr
      import numpy as np
      from scipy.integrate import odeint
      import matplotlib.pyplot as plt

      plt.clf()

      payload = json.loads('${JSON.stringify({ timeMax, equations })}')

      t = np.linspace(0, float(payload['timeMax']), 400)

      y_symbol, t_symbol = symbols('y t')

      for equation in payload['equations']:
        # Usually the mathematical constant e has to be written as E, but use allow_dict to recognize e as well.
        clean_expr = parse_expr(equation['equation'], local_dict={'e': E, 'π': pi}, transformations='all')
        func = lambdify((y_symbol, t_symbol), clean_expr, 'numpy')
        initial_condition = float(equation['initialCondition'])
        solution = odeint(func, initial_condition, t)
        plt.plot(t, solution, label='dy/dt = ' + equation['equation'])

      plt.xlabel('Time')
      plt.ylabel('y(t)')
      plt.legend()
      plt.show()
    `).then(() => {
      setBootedUp(true);
    });
  }, [ready, timeMax, equations, execute]);

  return (
    <div className="p-4">
      <Form.Root onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-[3fr,140px,max-content] gap-x-2 gap-y-3">
          {equations.map((equation, i) => (
            <Fragment key={i}>
              <InputBoxy
                name={`equation_${i}`}
                label="Equation"
                prefix="dy/dt="
                value={equation.equation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEquations((prevEquations) =>
                    prevEquations.map((eq, eqi) =>
                      eqi === i ? { ...eq, equation: e.target.value } : eq
                    )
                  );
                }}
              />
              <InputBoxy
                name={`initial_${i}`}
                label="Initial condition"
                prefix="y(0) ="
                value={equation.initialCondition}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEquations((prevEquations) =>
                    prevEquations.map((eq, eqi) =>
                      eqi === i
                        ? { ...eq, initialCondition: e.target.value }
                        : eq
                    )
                  );
                }}
              />
              <div className="self-start mt-[1.62rem]">
                <Button
                  type="button"
                  className="px-1.5 py-2"
                  onClick={() => {
                    if (equations.length === 1) {
                      setEquations([EMPTY_EQUATION]);
                      return;
                    }
                    setEquations((e) => e.filter((_, eqi) => eqi !== i));
                  }}
                >
                  &times;
                </Button>
              </div>
            </Fragment>
          ))}
        </div>

        <Button
          type="button"
          className="mt-4"
          onClick={() => {
            setEquations((e) => [...e, EMPTY_EQUATION]);
          }}
        >
          + Add equation ⤴
        </Button>

        <div className="mt-5 flex items-center gap-x-2 border-2 border-black px-4 py-3">
          <p className="font-medium">Graph from t = o to t =</p>
          <div className="w-24">
            <InputBoxy
              name="time_max"
              label={null}
              value={timeMax}
              onChange={(e) => setTimeMax(e.target.value)}
            />
          </div>
        </div>
      </Form.Root>

      <div ref={renderTargetRef} />

      {!bootedUp && (
        <div className="fixed inset-0 bg-black/50">
          <p className="text-white font-semibold text-white">
            Booting up grapher...
          </p>
        </div>
      )}
    </div>
  );
}
