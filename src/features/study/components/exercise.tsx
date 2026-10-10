"use client";

import { PencilLine } from "lucide-react";

import { Reveal } from "./reveal";

import type { ReactNode } from "react";

export function Answer({ children }: { children: ReactNode }) {
  return (
    <Reveal kind="answer">
      <div className="katex-left prose dark:prose-invert text-foreground max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:my-3">
        {children}
      </div>
    </Reveal>
  );
}

/**
 * Exercise card. Without a title it's numbered automatically ("Exercício 3")
 * by a CSS counter that runs across the page (see `.exercise-block` in
 * globals.css).
 */
export function Exercise({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="not-prose exercise-block border-border bg-background rounded-card shadow-soft my-8 border p-5 sm:p-6">
      <p className="text-foreground mb-3 flex items-center gap-2.5 text-[0.8125rem] font-semibold">
        <span className="bg-accent-soft text-accent rounded-chip flex h-6 w-6 shrink-0 items-center justify-center">
          <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        {title ?? <span className="exercise-number">Exercício</span>}
      </p>
      <div className="prose dark:prose-invert text-foreground max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:my-4">
        {children}
      </div>
    </div>
  );
}
