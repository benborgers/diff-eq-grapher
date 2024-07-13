export default function preprocessEquation(equation: string) {
  return equation.replace("pit", "pi t").replace("piy", "pi y");
}
