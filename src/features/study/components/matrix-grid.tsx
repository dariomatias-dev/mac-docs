"use client";

import type { ReactNode } from "react";

import { Dropdown } from "./form-controls";

export function DimensionSelect({
  label,
  value,
  onChange,
  min = 1,
  max = 4,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => ({
    value: String(n),
    label: String(n),
  }));

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted text-xs">{label}</span>
      <Dropdown
        ariaLabel={label}
        options={options}
        value={String(value)}
        onChange={(v) => onChange(Number(v))}
        size="sm"
        className="w-14"
        buttonClassName="justify-center"
      />
    </div>
  );
}

export function MatrixBox({ children }: { children: ReactNode }) {
  return (
    <div className="border-foreground/40 bg-background inline-block rounded-md border-2 p-2">
      {children}
    </div>
  );
}

export function resizeMatrix<T>(matrix: T[][], rows: number, cols: number, fill: T): T[][] {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => matrix[i]?.[j] ?? fill),
  );
}

function formatCell(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function NumberMatrixGrid({ matrix }: { matrix: number[][] }) {
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

export function BitMatrixGrid({
  matrix,
  onToggle,
  editable,
}: {
  matrix: (0 | 1)[][];
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
