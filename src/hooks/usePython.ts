import { useEffect, useRef, useState } from "react";
import { loadPyodide } from "pyodide";

declare global {
  interface Document {
    pyodideMplTarget: HTMLDivElement;
  }
}

export default function usePython() {
  const pyodide = useRef<Awaited<ReturnType<typeof loadPyodide>> | null>(null);
  const renderTargetRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
      packages: ["matplotlib", "sympy", "scipy"],
    }).then((p) => {
      pyodide.current = p;
      setReady(true);
    });
  }, []);

  const execute = async (code: string) => {
    if (!renderTargetRef.current) {
      throw new Error("renderTargetRef is not set");
    }

    if (!pyodide.current) {
      throw new Error("pyodide is not loaded");
    }

    await pyodide.current.runPythonAsync(code);

    document.pyodideMplTarget = renderTargetRef.current;
  };

  return {
    renderTargetRef,
    execute,
    ready,
  };
}
