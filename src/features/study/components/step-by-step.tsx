"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";

import { ArrowRight, Check, RotateCcw } from "lucide-react";

export function Step(_props: { title?: string; children: ReactNode }): null {
  return null;
}

export function StepByStep({
  title = "Resolução passo a passo",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const steps = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as { title?: string; children: ReactNode });

  const total = steps.length;
  const [visible, setVisible] = useState(1);
  const shown = Math.min(visible, total);
  const done = shown >= total;

  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface flex items-center justify-between gap-3 border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">{title}</p>
        <span className="text-muted text-xs font-medium">
          {shown} / {total}
        </span>
      </div>

      <div className="px-5 py-4">
        <ol className="space-y-4">
          {steps.slice(0, shown).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="bg-accent-soft text-accent mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                {step.title && <p className="text-foreground mb-1 font-semibold">{step.title}</p>}
                <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">
                  {step.children}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {done ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[0.8rem] font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <Check className="h-3.5 w-3.5" />
              Concluído
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(v + 1, total))}
              className="bg-accent text-accent-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-opacity hover:opacity-90"
            >
              Próximo passo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          {shown > 1 && (
            <button
              type="button"
              onClick={() => setVisible(1)}
              className="border-border text-muted hover:border-accent hover:bg-surface hover:text-accent inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recomeçar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
