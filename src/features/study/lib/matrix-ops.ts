export type Matrix = number[][];

export function addMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

export function subMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

export function scaleMatrix(a: Matrix, k: number): Matrix {
  return a.map((row) => row.map((v) => v * k));
}

export function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const cols = b[0].length;
  return a.map((row) =>
    Array.from({ length: cols }, (_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)),
  );
}

export function transpose(a: Matrix): Matrix {
  const cols = a[0].length;
  return Array.from({ length: cols }, (_, j) => a.map((row) => row[j]));
}
