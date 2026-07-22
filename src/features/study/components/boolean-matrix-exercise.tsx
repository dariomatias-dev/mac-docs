"use client";

import { useEffect, useState } from "react";

import { Eye, EyeOff, RefreshCw } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import { andMatrices, booleanProduct, orMatrices, type BitMatrix } from "../lib/boolean-matrix-ops";
import { matrixToLatex } from "../lib/matrix-latex";
import { randomBitMatrix, randomInt } from "../lib/random";
import { Katex } from "./katex-inline";

type Op = "or" | "and" | "multiply";

const ALL_OPS: Op[] = ["or", "and", "multiply"];

type GeneratedQuestion = {
  op: Op;
  a: BitMatrix;
  b: BitMatrix;
  result: BitMatrix;
};

const DEFAULT_QUESTION: GeneratedQuestion = {
  op: "or",
  a: [
    [1, 0],
    [0, 1],
  ],
  b: [
    [1, 1],
    [0, 0],
  ],
  result: [
    [1, 1],
    [0, 1],
  ],
};

function randomDim(): number {
  return randomInt(2, 3);
}

function generateQuestion(pool: Op[]): GeneratedQuestion {
  const op = pool[randomInt(0, pool.length - 1)];

  if (op === "multiply") {
    const rowsA = randomDim();
    const shared = randomDim();
    const colsB = randomDim();
    const a = randomBitMatrix(rowsA, shared);
    const b = randomBitMatrix(shared, colsB);
    return { op, a, b, result: booleanProduct(a, b) };
  }

  const rows = randomDim();
  const cols = randomDim();
  const a = randomBitMatrix(rows, cols);
  const b = randomBitMatrix(rows, cols);
  return { op, a, b, result: op === "or" ? orMatrices(a, b) : andMatrices(a, b) };
}

function statementFor(op: Op): string {
  switch (op) {
    case "or":
      return "Calcule A ∨ B (OU lógico, elemento a elemento):";
    case "and":
      return "Calcule A ∧ B (E lógico, elemento a elemento):";
    case "multiply":
      return "Calcule A ⊙ B (multiplicação booleana de matrizes):";
  }
}

function resultExprFor(op: Op): string {
  switch (op) {
    case "or":
      return "A \\vee B";
    case "and":
      return "A \\wedge B";
    case "multiply":
      return "A \\odot B";
  }
}

export function BooleanMatrixExercise({ operations = ALL_OPS }: { operations?: Op[] }) {
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
          Questão gerada — matrizes booleanas
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
        <p className="text-foreground mb-3 text-sm">{statementFor(question.op)}</p>

        <Katex expr={`A = ${matrixToLatex(question.a)} \\qquad B = ${matrixToLatex(question.b)}`} />

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
                <Katex expr={`${resultExprFor(question.op)} = ${matrixToLatex(question.result)}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
