"use client";

import { Check, ListChecks, RotateCcw, X } from "lucide-react";
import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";

import { Panel } from "./panel";

export function Option(_props: { correct?: boolean; children: ReactNode }): null {
  return null;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const LETTERS = "abcdefghij";

export function Quiz({
  question,
  explanation,
  children,
}: {
  question: ReactNode;
  explanation?: ReactNode;
  children: ReactNode;
}) {
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as { correct?: boolean; children: ReactNode });

  const [picked, setPicked] = useState<number | null>(null);
  const [order, setOrder] = useState(() => options.map((_, i) => i));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder((prev) => shuffle(prev));
  }, []);

  const answered = picked !== null;
  const isRight = answered && options[picked]?.correct;

  return (
    <Panel icon={ListChecks} title="Quiz">
      <div className="px-5 py-4">
        <div className="prose dark:prose-invert text-foreground mb-3 max-w-none">{question}</div>

        <ul className="space-y-2">
          {order.map((oi, position) => {
            const opt = options[oi];
            const correct = opt.correct;
            const chosen = picked === oi;
            let state =
              "border-border text-foreground hover:border-accent/60 hover:bg-surface active:scale-[0.995]";
            if (answered && correct)
              state =
                "border-green-500 bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-300";
            else if (chosen && !correct)
              state = "border-red-500 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300";
            else if (answered) state = "border-border text-muted";

            return (
              <li key={oi}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => setPicked(oi)}
                  className={`rounded-control flex w-full items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-[color,background-color,border-color,transform] ${state} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="rounded-chip flex h-6 w-6 shrink-0 items-center justify-center border border-current/25 text-xs font-semibold">
                      {LETTERS[position]}
                    </span>
                    <span>{opt.children}</span>
                  </span>
                  {answered && correct && <Check className="h-4 w-4 shrink-0" />}
                  {chosen && !correct && <X className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="bg-surface rounded-control mt-4 px-4 py-3 text-sm">
            <p
              className={`font-semibold ${
                isRight ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isRight ? "Correto!" : "Não é essa. Tente entender o porquê."}
            </p>
            {explanation && (
              <div className="prose dark:prose-invert text-muted mt-1.5 max-w-none">
                {explanation}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                setOrder((o) => shuffle(o));
              }}
              className="text-accent mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium hover:underline"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
