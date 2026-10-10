"use client";

import { ArrowRight, Check, ListOrdered, RotateCcw } from "lucide-react";
import { Children, isValidElement, useState, type ReactNode } from "react";

import { Panel } from "./panel";

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
    <Panel
      icon={ListOrdered}
      title={title}
      action={
        <span className="text-muted text-xs font-medium tabular-nums">
          {shown} / {total}
        </span>
      }
    >
      <div className="p-5 sm:p-6">
        <ol>
          {steps.slice(0, shown).map((step, i) => {
            const current = i === shown - 1;
            const isLast = i === total - 1;
            return (
              <li
                key={i}
                className={`relative flex gap-4 pb-6 last:pb-0 ${i > 0 && current ? "animate-rise" : ""}`}
              >
                {/* Rail to the next step; dashed while more steps are still hidden. */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-8 bottom-1 left-3 w-0 border-l-2 ${
                      current ? "border-border border-dashed" : "border-accent/30"
                    }`}
                  />
                )}
                <span
                  className={`relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    current ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {step.title && (
                    <p className="text-foreground mb-1.5 font-semibold tracking-[-0.01em]">
                      {step.title}
                    </p>
                  )}
                  <div className="katex-left prose dark:prose-invert text-foreground max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
                    {step.children}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="border-border mt-6 flex flex-wrap items-center gap-2 border-t pt-4 print:hidden">
          {done ? (
            <span className="rounded-control inline-flex items-center gap-1.5 bg-green-50 px-3 py-1.5 text-[0.8125rem] font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <Check className="h-3.5 w-3.5" />
              Concluído
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(v + 1, total))}
              className="bg-accent text-accent-foreground rounded-control inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-[opacity,transform] hover:opacity-90 active:scale-[0.98]"
            >
              Próximo passo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          {shown > 1 && (
            <button
              type="button"
              onClick={() => setVisible(1)}
              className="border-border text-muted-2 hover:border-border-strong hover:bg-surface hover:text-foreground rounded-control inline-flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recomeçar
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
}
