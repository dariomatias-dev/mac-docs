"use client";

import { useEffect, useState } from "react";

import { Eye, EyeOff, RefreshCw } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import { matrixToLatex } from "../lib/matrix-latex";
import {
  addMatrices,
  multiplyMatrices,
  scaleMatrix,
  subMatrices,
  transpose,
} from "../lib/matrix-ops";
import { randomInt, randomMatrix } from "../lib/random";
import { Katex } from "./katex-inline";

type Matrix = number[][];
type Op = "add" | "sub" | "multiply" | "scalar" | "transpose";

const ALL_OPS: Op[] = ["add", "sub", "multiply", "scalar", "transpose"];
const VALUE_MIN = -9;
const VALUE_MAX = 9;

type GeneratedQuestion = {
  op: Op;
  a: Matrix;
  b?: Matrix;
  k?: number;
  result: Matrix;
};

const DEFAULT_QUESTION: GeneratedQuestion = {
  op: "add",
  a: [
    [1, 2],
    [2, 3],
  ],
  b: [
    [-1, 2],
    [0, -2],
  ],
  result: [
    [0, 4],
    [2, 1],
  ],
};

function randomDim(): number {
  return randomInt(2, 3);
}

function generateQuestion(pool: Op[]): GeneratedQuestion {
  const op = pool[randomInt(0, pool.length - 1)];

  if (op === "add" || op === "sub") {
    const rows = randomDim();
    const cols = randomDim();
    const a = randomMatrix(rows, cols, VALUE_MIN, VALUE_MAX);
    const b = randomMatrix(rows, cols, VALUE_MIN, VALUE_MAX);
    return { op, a, b, result: op === "add" ? addMatrices(a, b) : subMatrices(a, b) };
  }

  if (op === "multiply") {
    const rowsA = randomDim();
    const shared = randomDim();
    const colsB = randomDim();
    const a = randomMatrix(rowsA, shared, VALUE_MIN, VALUE_MAX);
    const b = randomMatrix(shared, colsB, VALUE_MIN, VALUE_MAX);
    return { op, a, b, result: multiplyMatrices(a, b) };
  }

  if (op === "scalar") {
    const a = randomMatrix(randomDim(), randomDim(), VALUE_MIN, VALUE_MAX);
    let k = randomInt(-5, 5);
    while (k === 0 || k === 1) k = randomInt(-5, 5);
    return { op, a, k, result: scaleMatrix(a, k) };
  }

  const a = randomMatrix(randomDim(), randomDim(), VALUE_MIN, VALUE_MAX);
  return { op, a, result: transpose(a) };
}

function statementFor(q: GeneratedQuestion): string {
  switch (q.op) {
    case "add":
      return "Some as matrizes A e B a seguir (A + B):";
    case "sub":
      return "Subtraia as matrizes A e B a seguir (A − B):";
    case "multiply":
      return "Multiplique as matrizes A e B a seguir (A × B):";
    case "scalar":
      return `Calcule ${q.k} · A, sendo A a matriz a seguir:`;
    case "transpose":
      return "Determine a transposta de A (Aᵀ):";
  }
}

function resultExprFor(q: GeneratedQuestion): string {
  switch (q.op) {
    case "add":
      return "A + B";
    case "sub":
      return "A - B";
    case "multiply":
      return "A \\times B";
    case "scalar":
      return `${q.k} \\cdot A`;
    case "transpose":
      return "A^{T}";
  }
}

function statementLatex(q: GeneratedQuestion): string {
  const a = `A = ${matrixToLatex(q.a)}`;
  return q.b ? `${a} \\qquad B = ${matrixToLatex(q.b)}` : a;
}

export function MatrixExercise({ operations = ALL_OPS }: { operations?: Op[] }) {
  const [question, setQuestion] = useState<GeneratedQuestion>(DEFAULT_QUESTION);
  const { open, setOpen, toggle } = useDisclosure();

  const regenerate = () => {
    setOpen(false);
    setQuestion(generateQuestion(operations));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestion(generateQuestion(operations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface flex items-center justify-between border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">
          Questão gerada — matrizes
        </p>
        <button
          type="button"
          onClick={regenerate}
          className="text-muted hover:text-accent flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Gerar nova questão
        </button>
      </div>

      <div className="px-5 py-4">
        <p className="text-foreground mb-3 text-sm">{statementFor(question)}</p>

        <Katex expr={statementLatex(question)} />

        <div className="not-prose group mt-4" data-answer-open={open ? "" : undefined}>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="border-border hover:border-accent hover:bg-surface hover:text-accent flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-[0.8rem] font-medium transition-colors"
          >
            {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {open ? "Ocultar resposta" : "Ver resposta"}
          </button>

          <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-in-out group-data-answer-open:grid-rows-[1fr] group-data-answer-open:opacity-100">
            <div className="min-h-0 overflow-hidden">
              <div className="border-accent bg-accent-soft mt-3 rounded-lg border-l-2 px-4 py-3">
                <p className="text-accent mb-1.5 text-[0.7rem] font-bold tracking-[0.08em] uppercase">
                  Resposta
                </p>
                <Katex expr={`${resultExprFor(question)} = ${matrixToLatex(question.result)}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
