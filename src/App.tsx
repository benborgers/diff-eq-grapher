import { useState, Fragment, useEffect } from "react";
import InputBoxy from "./components/form/input-boxy";
import * as Form from "@radix-ui/react-form";
import Button from "./components/form/button";
import usePython from "./hooks/usePython";
import Booting from "./components/booting";
import Graph from "./components/graph";

type Equation = {
  equation: string;
  initialCondition: string;
};

const EMPTY_EQUATION: Equation = {
  equation: "",
  initialCondition: "",
};

export default function App() {
  const { renderTargetRef, execute, ready, error } = usePython();

  const [bootedUp, setBootedUp] = useState(false);
  const [equations, setEquations] = useState<Equation[]>([
    {
      equation: "y * (y-1)(1-y/10) - 0.1t",
      initialCondition: "10",
    },
  ]);
  const [timeMax, setTimeMax] = useState<string>("150");

  useEffect(() => {
    (async () => {
      if (!ready) {
        return;
      }

      const validEquations = equations.filter(
        (equation) => !Object.values(equation).includes("")
      );

      await execute(`
        import json
        from sympy import symbols, lambdify, E, pi
        from sympy.parsing.sympy_parser import parse_expr
        import numpy as np
        from scipy.integrate import odeint
        import matplotlib.pyplot as plt

        print(plt.get_backend())
      `);

      setBootedUp(true);
    })();
  }, [ready, timeMax, equations, execute]);

  return (
    <div>
      <div className="p-6 grid grid-cols-[550px,1fr] grid-rows-[1fr,max-content]">
        <Form.Root
          onSubmit={(e) => e.preventDefault()}
          className="mr-12 pr-12 border-r-2 border-dashed border-gray-300"
        >
          <div className="grid grid-cols-[3fr,120px,max-content] gap-x-2 gap-y-3">
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

        <Graph ref={renderTargetRef} />
      </div>

      {!bootedUp && <Booting />}

      {error && (
        <div className="fixed bottom-0 inset-x-0 bg-red-500 p-4 z-50">
          <p className="font-semibold text-white">
            Couldn’t graph equations — make sure all variables are correct.
          </p>
        </div>
      )}
    </div>
  );
}
