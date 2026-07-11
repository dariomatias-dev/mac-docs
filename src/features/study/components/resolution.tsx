"use client";

import { useState, type ReactNode } from "react";

import { Eye, EyeOff } from "lucide-react";

export function Resolution({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose mt-4" data-resolution-open={open ? "" : undefined}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="border-border hover:border-accent hover:bg-surface hover:text-accent flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-[0.8rem] font-medium transition-colors"
      >
        {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        {open ? "Ocultar resolução" : "Ver resolução"}
      </button>

      <div className="resolution-content">
        <div>
          <div className="resolution prose prose-sm dark:prose-invert text-foreground mt-3 max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
