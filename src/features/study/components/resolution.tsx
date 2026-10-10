"use client";

import { Reveal } from "./reveal";

import type { ReactNode } from "react";

export function Resolution({ children }: { children: ReactNode }) {
  return (
    <Reveal kind="resolution">
      <div className="katex-left no-math-copy prose dark:prose-invert text-foreground max-w-none [&_p]:my-3 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </Reveal>
  );
}
