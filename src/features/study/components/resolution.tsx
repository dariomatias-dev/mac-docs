"use client";

import type { ReactNode } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

export function Resolution({ children }: { children: ReactNode }) {
  const { open, toggle } = useDisclosure();

  return (
    <div className="not-prose group mt-4" data-resolution-open={open ? "" : undefined}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="border-border hover:border-accent hover:bg-surface hover:text-accent flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-[0.8rem] font-medium transition-colors"
      >
        {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        {open ? "Ocultar resolução" : "Ver resolução"}
      </button>

      <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-in-out group-data-resolution-open:grid-rows-[1fr] group-data-resolution-open:opacity-100">
        <div className="min-h-0 overflow-hidden">
          <div className="katex-left no-math-copy border-border prose prose-sm dark:prose-invert text-foreground mt-3 ml-4 max-w-none border-l-2 pl-4 [&_p]:my-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
