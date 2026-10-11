"use client";

import { Reveal } from "./reveal";

import type { ReactNode } from "react";

export function Resolution({ children }: { children: ReactNode }) {
  return (
    <Reveal kind="resolution">
      {/* The enclosing Question is `not-prose`, which also switches off the
          list styles of this nested `prose`, so lists are restyled here. */}
      <div className="katex-left no-math-copy prose dark:prose-invert text-foreground max-w-none [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </Reveal>
  );
}
