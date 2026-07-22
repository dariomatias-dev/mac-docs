export function matrixToLatex(m: number[][]): string {
  return `\\begin{bmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
}
