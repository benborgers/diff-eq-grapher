let pyodide: Awaited<
  ReturnType<typeof import("pyodide")["loadPyodide"]>
> | null = null;

const load = async () => {
  const { loadPyodide } = await import("pyodide");

  if (pyodide) {
    return;
  }

  const p = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
    packages: ["matplotlib", "sympy", "scipy"],
  });

  pyodide = p;
};

addEventListener("message", async (event) => {
  await load();
  const payload: { code: string } = JSON.parse(event.data);
  const result = await pyodide?.runPythonAsync(payload.code);
  postMessage({ result });
});
