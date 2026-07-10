"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Dropdown, TextField } from "./form-controls";
import { DimensionSelect, MatrixBox, resizeMatrix } from "./matrix-grid";

type Matrix = number[][];

type NamedMatrix = { id: string; rows: number; cols: number; values: Matrix };

type ChainStep =
  | { id: string; kind: "scalar"; value: number }
  | { id: string; kind: "add" | "sub" | "multiply"; matrixId: string };

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const MAX_MATRICES = LETTERS.length;
const MAX_STEPS = 6;

const OPERATOR_OPTIONS = [
  { value: "add", label: "+" },
  { value: "sub", label: "−" },
  { value: "multiply", label: "×" },
  { value: "scalar", label: "escalar ×" },
];

function addMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function subMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

function scaleMatrix(a: Matrix, k: number): Matrix {
  return a.map((row) => row.map((v) => v * k));
}

function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const cols = b[0].length;
  return a.map((row) =>
    Array.from({ length: cols }, (_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)),
  );
}

function formatCell(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function isZero(m: Matrix): boolean {
  return m.every((row) => row.every((v) => v === 0));
}

function isIdentity(m: Matrix): boolean {
  return (
    m.length === m[0].length && m.every((row, i) => row.every((v, j) => v === (i === j ? 1 : 0)))
  );
}

function isDiagonal(m: Matrix): boolean {
  return m.length === m[0].length && m.every((row, i) => row.every((v, j) => i === j || v === 0));
}

function isSymmetric(m: Matrix): boolean {
  return m.length === m[0].length && m.every((row, i) => row.every((v, j) => v === m[j][i]));
}

function sameMatrix(a: Matrix, b: Matrix): boolean {
  return (
    a.length === b.length &&
    a[0].length === b[0].length &&
    a.every((row, i) => row.every((v, j) => v === b[i][j]))
  );
}

function stepMatrixId(step: ChainStep): string | null {
  return step.kind === "scalar" ? null : step.matrixId;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-muted text-xs font-medium tracking-wide uppercase">{children}</p>;
}

function MatrixInput({
  matrix,
  onCellChange,
}: {
  matrix: Matrix;
  onCellChange: (row: number, col: number, value: number) => void;
}) {
  return (
    <MatrixBox>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(0, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((value, j) => (
            <TextField
              key={`${i}-${j}`}
              type="number"
              value={value}
              onChange={(e) => onCellChange(i, j, Number(e.target.value) || 0)}
              className="bg-surface h-9 w-9 rounded text-center text-xs"
              aria-label={`Elemento linha ${i + 1}, coluna ${j + 1}`}
            />
          )),
        )}
      </div>
    </MatrixBox>
  );
}

function MatrixOutput({ matrix }: { matrix: Matrix }) {
  return (
    <MatrixBox>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(0, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((value, j) => (
            <div
              key={`${i}-${j}`}
              className="text-foreground flex h-9 w-9 items-center justify-center font-mono text-xs"
            >
              {formatCell(value)}
            </div>
          )),
        )}
      </div>
    </MatrixBox>
  );
}

type ChainResult = { final?: Matrix; error?: string };

function evaluateChain(
  matrices: NamedMatrix[],
  seedId: string,
  steps: ChainStep[],
  labelFor: (id: string) => string,
): ChainResult {
  const seed = matrices.find((m) => m.id === seedId);
  if (!seed) return {};

  let acc = seed.values;
  // Tracks the expression built so far ("A", "A + B", "2 · A"...) so a
  // dimension-mismatch error can name the actual matrices involved instead of
  // a generic "resultado parcial".
  let accLabel = labelFor(seedId);

  for (const step of steps) {
    if (step.kind === "scalar") {
      acc = scaleMatrix(acc, step.value);
      accLabel = `${step.value} · (${accLabel})`;
      continue;
    }

    const operand = matrices.find((m) => m.id === step.matrixId);
    if (!operand) continue;
    const opLabel = labelFor(step.matrixId);
    const accRows = acc.length;
    const accCols = acc[0].length;

    if (step.kind === "multiply") {
      if (accCols !== operand.rows) {
        return {
          error: `Nº de colunas de ${accLabel} (${accCols}) precisa ser igual ao nº de linhas de ${opLabel} (${operand.rows}) para multiplicar ${accLabel} × ${opLabel}.`,
        };
      }
      acc = multiplyMatrices(acc, operand.values);
      accLabel = `${accLabel} × ${opLabel}`;
    } else {
      if (accRows !== operand.rows || accCols !== operand.cols) {
        return {
          error: `${accLabel} (${accRows}×${accCols}) e ${opLabel} (${operand.rows}×${operand.cols}) precisam ter a mesma ordem para ${
            step.kind === "add" ? "somar" : "subtrair"
          }.`,
        };
      }
      acc =
        step.kind === "add" ? addMatrices(acc, operand.values) : subMatrices(acc, operand.values);
      accLabel = `${accLabel} ${step.kind === "add" ? "+" : "−"} ${opLabel}`;
    }
  }

  return { final: acc };
}

export function MatrixCalculator() {
  const matrixIdCounter = useRef(2);
  const stepIdCounter = useRef(1);

  const [matrices, setMatrices] = useState<NamedMatrix[]>([
    {
      id: "m0",
      rows: 2,
      cols: 2,
      values: [
        [1, 2],
        [2, 3],
      ],
    },
    {
      id: "m1",
      rows: 2,
      cols: 2,
      values: [
        [-1, 2],
        [0, -2],
      ],
    },
  ]);

  const [seedId, setSeedId] = useState("m0");
  const [steps, setSteps] = useState<ChainStep[]>([{ id: "s0", kind: "add", matrixId: "m1" }]);

  const labelFor = (id: string) => {
    const index = matrices.findIndex((m) => m.id === id);
    return index === -1 ? "?" : LETTERS[index];
  };

  const usedIds = new Set(
    [seedId, ...steps.map(stepMatrixId)].filter((id): id is string => id !== null),
  );

  const updateDims = (id: string, rows: number, cols: number) =>
    setMatrices((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, rows, cols, values: resizeMatrix(m.values, rows, cols, 0) } : m,
      ),
    );

  const updateCell = (id: string, i: number, j: number, value: number) =>
    setMatrices((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              values: m.values.map((row, ri) =>
                ri === i ? row.map((c, ci) => (ci === j ? value : c)) : row,
              ),
            }
          : m,
      ),
    );

  const addMatrix = () => {
    const id = `m${matrixIdCounter.current++}`;
    setMatrices((prev) => [...prev, { id, rows: 2, cols: 2, values: resizeMatrix([], 2, 2, 0) }]);
  };

  const removeMatrix = (id: string) => {
    if (matrices.length <= 1 || usedIds.has(id)) return;
    setMatrices((prev) => prev.filter((m) => m.id !== id));
  };

  const addStep = () => {
    const id = `s${stepIdCounter.current++}`;
    const fallbackMatrix = matrices.find((m) => m.id !== seedId)?.id ?? matrices[0].id;
    setSteps((prev) => [...prev, { id, kind: "add", matrixId: fallbackMatrix }]);
  };

  const removeStep = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id));

  const updateStep = (id: string, next: ChainStep) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? next : s)));

  const result = useMemo(
    () => evaluateChain(matrices, seedId, steps, labelFor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matrices, seedId, steps],
  );

  // Only meaningful for a single seed × operand product — reinforces the
  // "matrix multiplication isn't commutative" lesson taught right above.
  const commutativityCheck = useMemo(() => {
    const first = steps[0];
    if (steps.length !== 1 || first.kind !== "multiply" || result.error) return null;
    const seed = matrices.find((m) => m.id === seedId);
    const operand = matrices.find((m) => m.id === first.matrixId);
    if (!seed || !operand || operand.cols !== seed.rows) return null;
    const reverse = multiplyMatrices(operand.values, seed.values);
    const commutes = result.final ? sameMatrix(result.final, reverse) : false;
    return { reverse, commutes };
  }, [steps, result, matrices, seedId]);

  const properties = useMemo(() => {
    if (!result.final) return [];
    const list: string[] = [];
    if (isZero(result.final)) list.push("Matriz nula");
    if (isIdentity(result.final)) list.push("Matriz identidade");
    if (isDiagonal(result.final)) list.push("Matriz diagonal");
    if (isSymmetric(result.final)) list.push("Matriz simétrica");
    return list;
  }, [result.final]);

  const iconButtonClass =
    "text-muted hover:text-red-600 hover:bg-red-500/10 dark:hover:text-red-400 cursor-pointer shrink-0 rounded p-1.5 transition-colors";
  const addButtonClass =
    "border-border text-muted hover:border-accent hover:text-accent inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  const matrixOptions = matrices.map((m) => ({ value: m.id, label: labelFor(m.id) }));

  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">
          Calculadora de matrizes
        </p>
      </div>

      <div className="space-y-5 px-5 py-4">
        <div className="space-y-3">
          <SectionLabel>Matrizes</SectionLabel>

          <div className="flex flex-wrap gap-4">
            {matrices.map((m) => (
              <div key={m.id} className="border-border space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-accent-soft text-accent flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {labelFor(m.id)}
                    </span>
                    <DimensionSelect
                      label="linhas"
                      value={m.rows}
                      onChange={(n) => updateDims(m.id, n, m.cols)}
                    />
                    <DimensionSelect
                      label="colunas"
                      value={m.cols}
                      onChange={(n) => updateDims(m.id, m.rows, n)}
                    />
                  </div>
                  {matrices.length > 1 && !usedIds.has(m.id) && (
                    <button
                      type="button"
                      onClick={() => removeMatrix(m.id)}
                      aria-label={`Remover matriz ${labelFor(m.id)}`}
                      className={iconButtonClass}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <MatrixInput
                  matrix={m.values}
                  onCellChange={(i, j, v) => updateCell(m.id, i, j, v)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMatrix}
            disabled={matrices.length >= MAX_MATRICES}
            className={addButtonClass}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar matriz
          </button>
        </div>

        <div className="border-border space-y-2 border-t pt-5">
          <SectionLabel>Expressão</SectionLabel>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Resultado =</span>
            <Dropdown
              ariaLabel="Matriz inicial"
              options={matrixOptions}
              value={seedId}
              onChange={setSeedId}
              size="sm"
              className="w-16"
            />

            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-1">
                <Dropdown
                  ariaLabel="Operador"
                  options={OPERATOR_OPTIONS}
                  value={step.kind}
                  onChange={(value) => {
                    const kind = value as ChainStep["kind"];
                    if (kind === "scalar") {
                      updateStep(step.id, { id: step.id, kind: "scalar", value: 2 });
                    } else {
                      const matrixId =
                        stepMatrixId(step) ??
                        matrices.find((m) => m.id !== seedId)?.id ??
                        matrices[0].id;
                      updateStep(step.id, { id: step.id, kind, matrixId });
                    }
                  }}
                  size="sm"
                  className="w-24"
                />

                {step.kind === "scalar" ? (
                  <TextField
                    type="number"
                    value={step.value}
                    onChange={(e) =>
                      updateStep(step.id, {
                        id: step.id,
                        kind: "scalar",
                        value: Number(e.target.value) || 0,
                      })
                    }
                    className="w-16 rounded px-2 py-1 text-xs"
                  />
                ) : (
                  <Dropdown
                    ariaLabel="Matriz"
                    options={matrixOptions}
                    value={step.matrixId}
                    onChange={(value) =>
                      updateStep(step.id, { id: step.id, kind: step.kind, matrixId: value })
                    }
                    size="sm"
                    className="w-16"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  aria-label="Remover passo"
                  className={iconButtonClass}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addStep}
              disabled={steps.length >= MAX_STEPS}
              className={addButtonClass}
            >
              <Plus className="h-3.5 w-3.5" />
              Passo
            </button>
          </div>
        </div>

        <div aria-live="polite" className="border-border space-y-2 border-t pt-5">
          <SectionLabel>Resultado</SectionLabel>
          {result.error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
          ) : (
            result.final && <MatrixOutput matrix={result.final} />
          )}
        </div>

        {result.final && (properties.length > 0 || commutativityCheck) && (
          <div className="border-border space-y-3 border-t pt-5">
            {properties.length > 0 && (
              <div className="space-y-2">
                <SectionLabel>Propriedades do resultado</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {properties.map((p) => (
                    <span
                      key={p}
                      className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {commutativityCheck && (
              <div className="border-border bg-surface rounded-lg border px-4 py-3">
                <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
                  Comparando com a ordem trocada
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <MatrixOutput matrix={commutativityCheck.reverse} />
                  <p
                    className={`text-sm ${
                      commutativityCheck.commutes
                        ? "text-green-600 dark:text-green-400"
                        : "text-foreground"
                    }`}
                  >
                    {commutativityCheck.commutes
                      ? "As matrizes comutam neste caso (exceção)."
                      : "Ordem trocada dá um resultado diferente — a multiplicação de matrizes não é comutativa."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
