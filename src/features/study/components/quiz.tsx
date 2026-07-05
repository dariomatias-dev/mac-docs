"use client";

import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";

import { Check, X } from "lucide-react";

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
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">Quiz</p>
      </div>

      <div className="px-5 py-4">
        <div className="prose prose-sm dark:prose-invert text-foreground mb-3 max-w-none">
          {question}
        </div>

        <ul className="space-y-2">
          {order.map((oi) => {
            const opt = options[oi];
            const correct = opt.correct;
            const chosen = picked === oi;
            let state = "border-border text-foreground hover:border-accent hover:bg-surface";
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
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${state} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span>{opt.children}</span>
                  {answered && correct && <Check className="h-4 w-4 shrink-0" />}
                  {chosen && !correct && <X className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="mt-3 text-sm">
            <p
              className={`font-semibold ${
                isRight ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isRight ? "Correto!" : "Não é essa — tente entender o porquê."}
            </p>
            {explanation && (
              <div className="prose prose-sm dark:prose-invert text-muted mt-1.5 max-w-none">
                {explanation}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                setOrder((o) => shuffle(o));
              }}
              className="text-accent mt-2 cursor-pointer text-xs font-medium hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
