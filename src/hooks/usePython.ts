import { useCallback, useEffect, useRef, useState } from "react";
import Worker from "web-worker";
import { loadPyodide } from "pyodide";

declare global {
  interface Document {
    pyodideMplTarget: HTMLDivElement;
  }
}

const url = new URL("../lib/python-worker.ts", import.meta.url);
const worker = new Worker(url);

export default function usePython() {
  const pyodide = useRef<Awaited<ReturnType<typeof loadPyodide>> | null>(null);
  const renderTargetRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // loadPyodide({
    //   indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
    //   packages: ["matplotlib", "sympy", "scipy"],
    // }).then((p) => {
    //   pyodide.current = p;
    //   setReady(true);
    // });
  }, []);

  const execute = useCallback(async (code: string) => {
    worker.postMessage(JSON.stringify({ code }));

    worker.addEventListener("message", (event) => {
      console.log(event.data);
    });

    // if (!renderTargetRef.current) {
    //   throw new Error("renderTargetRef is not set");
    // }
    // if (!pyodide.current) {
    //   throw new Error("pyodide is not loaded");
    // }
    // document.pyodideMplTarget = renderTargetRef.current;
    // setError(false);
    // try {
    //   await pyodide.current.runPythonAsync(code);
    // } catch {
    //   setError(true);
    // }
  }, []);

  return {
    renderTargetRef,
    execute,
    ready: true,
    error,
  };
}
