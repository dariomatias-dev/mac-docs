"use client";

import { Dices, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import { Katex } from "./katex-inline";
import { Panel } from "./panel";
import { Reveal } from "./reveal";
import { andMatrices, booleanProduct, orMatrices, type BitMatrix } from "../lib/boolean-matrix-ops";
import { matrixToLatex } from "../lib/matrix-latex";
import { randomBitMatrix, randomInt } from "../lib/random";

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
    <Panel
      icon={Dices}
      title="Questão gerada: matrizes booleanas"
      action={
        <button
          type="button"
          onClick={regenerate}
          className="text-muted hover:text-accent flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Gerar nova questão
        </button>
      }
    >
      <div className="px-5 py-4">
        <p className="text-foreground mb-3 text-sm">{statementFor(question.op)}</p>

        <Katex expr={`A = ${matrixToLatex(question.a)} \\qquad B = ${matrixToLatex(question.b)}`} />

        <Reveal kind="answer" open={open} onToggle={toggle}>
          <Katex expr={`${resultExprFor(question.op)} = ${matrixToLatex(question.result)}`} />
        </Reveal>
      </div>
    </Panel>
  );
}
