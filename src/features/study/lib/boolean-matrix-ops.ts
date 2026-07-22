export type BitMatrix = (0 | 1)[][];

export function orMatrices(a: BitMatrix, b: BitMatrix): BitMatrix {
  return a.map((row, i) => row.map((v, j) => (v === 1 || b[i][j] === 1 ? 1 : 0)));
}

export function andMatrices(a: BitMatrix, b: BitMatrix): BitMatrix {
  return a.map((row, i) => row.map((v, j) => (v === 1 && b[i][j] === 1 ? 1 : 0)));
}

export function booleanProduct(a: BitMatrix, b: BitMatrix): BitMatrix {
  const cols = b[0].length;
  return a.map((row) =>
    Array.from({ length: cols }, (_, j) => (row.some((v, k) => v === 1 && b[k][j] === 1) ? 1 : 0)),
  );
}
