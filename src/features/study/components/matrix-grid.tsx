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
