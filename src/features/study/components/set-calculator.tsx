"use client";

import { useId, useMemo, useState } from "react";

import { TextField } from "./form-controls";

type Operation = "union" | "intersection" | "difference-ab" | "difference-ba" | "symmetric";

const OPERATIONS: { id: Operation; label: string; symbol: string }[] = [
  { id: "union", label: "União", symbol: "A ∪ B" },
  { id: "intersection", label: "Interseção", symbol: "A ∩ B" },
  { id: "difference-ab", label: "Diferença", symbol: "A − B" },
  { id: "difference-ba", label: "Diferença", symbol: "B − A" },
  { id: "symmetric", label: "Diferença simétrica", symbol: "A △ B" },
];

function parseSet(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const el = part.trim();
    if (el === "" || seen.has(el)) continue;
    seen.add(el);
    out.push(el);
  }
  return out;
}

function compute(a: string[], b: string[], op: Operation): Set<string> {
  const setA = new Set(a);
  const setB = new Set(b);
  switch (op) {
    case "union":
      return new Set([...a, ...b]);
    case "intersection":
      return new Set(a.filter((x) => setB.has(x)));
    case "difference-ab":
      return new Set(a.filter((x) => !setB.has(x)));
    case "difference-ba":
      return new Set(b.filter((x) => !setA.has(x)));
    case "symmetric":
      return new Set([...a.filter((x) => !setB.has(x)), ...b.filter((x) => !setA.has(x))]);
  }
}

// Which regions of the two-circle Venn diagram light up for each operation.
const HIGHLIGHTED_REGIONS: Record<Operation, { onlyA: boolean; both: boolean; onlyB: boolean }> = {
  union: { onlyA: true, both: true, onlyB: true },
  intersection: { onlyA: false, both: true, onlyB: false },
  "difference-ab": { onlyA: true, both: false, onlyB: false },
  "difference-ba": { onlyA: false, both: false, onlyB: true },
  symmetric: { onlyA: true, both: false, onlyB: true },
};

const HIGHLIGHT_FILL = "fill-accent/45";
const DIM_FILL = "fill-foreground/[0.06]";

export function SetCalculator() {
  const [rawA, setRawA] = useState("1, 2, 3, 4");
  const [rawB, setRawB] = useState("3, 4, 5, 6");
  const [op, setOp] = useState<Operation>("union");

  const inputIdA = useId();
  const inputIdB = useId();

  const setA = useMemo(() => parseSet(rawA), [rawA]);
  const setB = useMemo(() => parseSet(rawB), [rawB]);
  const result = useMemo(() => compute(setA, setB, op), [setA, setB, op]);
  const regions = HIGHLIGHTED_REGIONS[op];

  const resultLabel = result.size === 0 ? "∅" : `{ ${[...result].join(", ")} }`;

  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">
          Calculadora de conjuntos
        </p>
      </div>

      <div className="grid gap-6 px-5 py-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor={inputIdA} className="text-foreground mb-1 block text-sm font-medium">
              Conjunto A
            </label>
            <TextField
              id={inputIdA}
              type="text"
              value={rawA}
              onChange={(e) => setRawA(e.target.value)}
              placeholder="ex: 1, 2, 3"
              className="w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor={inputIdB} className="text-foreground mb-1 block text-sm font-medium">
              Conjunto B
            </label>
            <TextField
              id={inputIdB}
              type="text"
              value={rawB}
              onChange={(e) => setRawB(e.target.value)}
              placeholder="ex: 3, 4, 5"
              className="w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-foreground mb-1.5 block text-sm font-medium">Operação</p>
            <div className="flex flex-wrap gap-1.5">
              {OPERATIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOp(o.id)}
                  aria-pressed={op === o.id}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    op === o.id
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  {o.symbol}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" className="border-border bg-surface rounded-lg border px-4 py-3">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">
              Resultado — {OPERATIONS.find((o) => o.id === op)?.symbol}
            </p>
            <p className="text-foreground mt-1 font-mono text-sm wrap-break-word">{resultLabel}</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <VennDiagram setA={setA} setB={setB} regions={regions} />
        </div>
      </div>
    </div>
  );
}

function VennDiagram({
  setA,
  setB,
  regions,
}: {
  setA: string[];
  setB: string[];
  regions: { onlyA: boolean; both: boolean; onlyB: boolean };
}) {
  const setBSet = new Set(setB);
  const setASet = new Set(setA);
  const onlyA = setA.filter((x) => !setBSet.has(x));
  const both = setA.filter((x) => setBSet.has(x));
  const onlyB = setB.filter((x) => !setASet.has(x));

  const fmt = (els: string[]) =>
    els.length > 6 ? `${els.slice(0, 6).join(", ")}…` : els.join(", ");

  return (
    <div className="w-full max-w-xs">
      <svg
        viewBox="0 0 300 200"
        role="img"
        aria-label="Diagrama de Venn dos conjuntos A e B"
        className="w-full"
      >
        <defs>
          {/* Each region paints exactly once: masks carve the exclusive crescents so
              they never sit underneath the overlap layer (translucent fills would
              otherwise blend and muddy the intersection color). */}
          <mask id="venn-only-a-mask">
            <rect x="0" y="0" width="300" height="200" fill="black" />
            <circle cx="120" cy="100" r="80" fill="white" />
            <circle cx="180" cy="100" r="80" fill="black" />
          </mask>
          <mask id="venn-only-b-mask">
            <rect x="0" y="0" width="300" height="200" fill="black" />
            <circle cx="180" cy="100" r="80" fill="white" />
            <circle cx="120" cy="100" r="80" fill="black" />
          </mask>
          <clipPath id="venn-overlap-clip">
            <circle cx="120" cy="100" r="80" />
          </clipPath>
        </defs>

        <circle
          cx="120"
          cy="100"
          r="80"
          className="stroke-foreground/60 fill-none"
          strokeWidth="1.5"
        />
        <circle
          cx="180"
          cy="100"
          r="80"
          className="stroke-foreground/60 fill-none"
          strokeWidth="1.5"
        />

        <rect
          x="0"
          y="0"
          width="300"
          height="200"
          mask="url(#venn-only-a-mask)"
          className={regions.onlyA ? HIGHLIGHT_FILL : DIM_FILL}
        />
        <rect
          x="0"
          y="0"
          width="300"
          height="200"
          mask="url(#venn-only-b-mask)"
          className={regions.onlyB ? HIGHLIGHT_FILL : DIM_FILL}
        />
        <circle
          cx="180"
          cy="100"
          r="80"
          clipPath="url(#venn-overlap-clip)"
          className={regions.both ? HIGHLIGHT_FILL : DIM_FILL}
        />

        <text x="70" y="40" textAnchor="middle" className="fill-foreground text-sm font-semibold">
          A
        </text>
        <text x="230" y="40" textAnchor="middle" className="fill-foreground text-sm font-semibold">
          B
        </text>

        <text x="85" y="100" textAnchor="middle" className="fill-foreground text-[10px]">
          {fmt(onlyA)}
        </text>
        <text x="150" y="100" textAnchor="middle" className="fill-foreground text-[10px]">
          {fmt(both)}
        </text>
        <text x="215" y="100" textAnchor="middle" className="fill-foreground text-[10px]">
          {fmt(onlyB)}
        </text>
      </svg>
    </div>
  );
}
