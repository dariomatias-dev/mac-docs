export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomMatrix(rows: number, cols: number, min: number, max: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => randomInt(min, max)),
  );
}

export function randomBitMatrix(rows: number, cols: number): (0 | 1)[][] {
  return Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => (Math.random() < 0.5 ? 0 : 1)) as (0 | 1)[],
  );
}
