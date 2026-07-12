"use client";

import { useMemo, useState } from "react";

import { CalculatorCard, OperatorPicker } from "./calculator-shell";
import { DimensionSelect, MatrixBox, resizeMatrix } from "./matrix-grid";

type BitMatrix = (0 | 1)[][];
type Operation = "or" | "and" | "multiply";

const OPERATIONS: { id: Operation; label: string }[] = [
  { id: "or", label: "Soma booleana (A ∨ B)" },
  { id: "and", label: "Produto booleano (A ∧ B)" },
  { id: "multiply", label: "Produto de matrizes (A ⊙ B)" },
];

function orMatrices(a: BitMatrix, b: BitMatrix): BitMatrix {
  return a.map((row, i) => row.map((v, j) => (v === 1 || b[i][j] === 1 ? 1 : 0)));
}

function andMatrices(a: BitMatrix, b: BitMatrix): BitMatrix {
  return a.map((row, i) => row.map((v, j) => (v === 1 && b[i][j] === 1 ? 1 : 0)));
}

function booleanProduct(a: BitMatrix, b: BitMatrix): BitMatrix {
  const cols = b[0].length;
  return a.map((row) =>
    Array.from({ length: cols }, (_, j) => (row.some((v, k) => v === 1 && b[k][j] === 1) ? 1 : 0)),
  );
}

function BitMatrixGrid({
  matrix,
  onToggle,
  editable,
}: {
  matrix: BitMatrix;
  onToggle?: (row: number, col: number) => void;
  editable: boolean;
}) {
  return (
    <MatrixBox>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(0, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((value, j) =>
            editable ? (
              <button
                key={`${i}-${j}`}
                type="button"
                onClick={() => onToggle?.(i, j)}
                aria-label={`Alternar elemento linha ${i + 1}, coluna ${j + 1}, valor atual ${value}`}
                className="border-border bg-surface text-foreground hover:border-accent hover:text-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded border text-sm font-semibold transition-colors"
              >
                {value}
              </button>
            ) : (
              <div
                key={`${i}-${j}`}
                className="text-foreground flex h-8 w-8 items-center justify-center font-mono text-sm"
              >
                {value}
              </div>
            ),
          ),
        )}
      </div>
    </MatrixBox>
  );
}

export function BooleanMatrixCalculator() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [matrixA, setMatrixA] = useState<BitMatrix>([
    [1, 0],
    [0, 1],
  ]);

  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixB, setMatrixB] = useState<BitMatrix>([
    [1, 1],
    [0, 0],
  ]);

  const [op, setOp] = useState<Operation>("or");

  const result = useMemo<{ matrix: BitMatrix } | { error: string }>(() => {
    if (op === "multiply") {
      if (colsA !== rowsB)
        return {
          error: `Nº de colunas de A (${colsA}) precisa ser igual ao nº de linhas de B (${rowsB}).`,
        };
      return { matrix: booleanProduct(matrixA, matrixB) };
    }
    if (rowsA !== rowsB || colsA !== colsB)
      return {
        error: `A (${rowsA}×${colsA}) e B (${rowsB}×${colsB}) precisam ter a mesma ordem para essa operação.`,
      };
    return { matrix: op === "or" ? orMatrices(matrixA, matrixB) : andMatrices(matrixA, matrixB) };
  }, [op, matrixA, matrixB, rowsA, colsA, rowsB, colsB]);

  const toggle = (setMatrix: typeof setMatrixA, i: number, j: number) =>
    setMatrix((m) =>
      m.map((row, ri) =>
        ri === i ? row.map((c, ci) => (ci === j ? ((1 - c) as 0 | 1) : c)) : row,
      ),
    );

  return (
    <CalculatorCard title="Calculadora de matrizes booleanas">
      <div className="space-y-5 px-5 py-4">
        <p className="text-muted text-sm">Clique nas células para alternar entre 0 e 1.</p>

        <div className="flex flex-wrap items-start gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-medium">Matriz A</span>
              <DimensionSelect
                label="linhas"
                value={rowsA}
                onChange={(n) => {
                  setRowsA(n);
                  setMatrixA((m) => resizeMatrix(m, n, colsA, 0));
                }}
              />
              <DimensionSelect
                label="colunas"
                value={colsA}
                onChange={(n) => {
                  setColsA(n);
                  setMatrixA((m) => resizeMatrix(m, rowsA, n, 0));
                }}
              />
            </div>
            <BitMatrixGrid
              matrix={matrixA}
              editable
              onToggle={(i, j) => toggle(setMatrixA, i, j)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-medium">Matriz B</span>
              <DimensionSelect
                label="linhas"
                value={rowsB}
                onChange={(n) => {
                  setRowsB(n);
                  setMatrixB((m) => resizeMatrix(m, n, colsB, 0));
                }}
              />
              <DimensionSelect
                label="colunas"
                value={colsB}
                onChange={(n) => {
                  setColsB(n);
                  setMatrixB((m) => resizeMatrix(m, rowsB, n, 0));
                }}
              />
            </div>
            <BitMatrixGrid
              matrix={matrixB}
              editable
              onToggle={(i, j) => toggle(setMatrixB, i, j)}
            />
          </div>
        </div>

        <div>
          <p className="text-foreground mb-1.5 text-sm font-medium">Operação</p>
          <OperatorPicker options={OPERATIONS} value={op} onChange={setOp} />
        </div>

        <div aria-live="polite" className="border-border bg-surface rounded-lg border px-4 py-3">
          <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
            Resultado — {OPERATIONS.find((o) => o.id === op)?.label}
          </p>
          {"error" in result ? (
            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
          ) : (
            <BitMatrixGrid matrix={result.matrix} editable={false} />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
}
