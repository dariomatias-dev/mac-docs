"use client";

import { useState, type ReactNode } from "react";

import { CircleHelp, Eye, EyeOff } from "lucide-react";

export function Answer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose group mt-4" data-answer-open={open ? "" : undefined}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
            <div className="katex-left prose prose-sm dark:prose-invert text-foreground max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Exercise({
  title = "Exercício proposto",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface border-b px-5 py-3">
        <p className="text-accent flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase">
          <CircleHelp className="h-4 w-4" />
          {title}
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
