"use client";

import { Reveal } from "./reveal";
import { RESOLUTION_METHODS, type ResolutionMethod } from "../lib/resolution-methods";

import type { ReactNode } from "react";

export function Resolution({
  method,
  children,
}: {
  /** Technique used, shown in the button so alternative resolutions are told apart. */
  method?: ResolutionMethod;
  children: ReactNode;
}) {
  return (
    <Reveal kind="resolution" qualifier={method ? RESOLUTION_METHODS[method] : undefined}>
      {/* The enclosing Question is `not-prose`, which also switches off the
          list styles of this nested `prose`, so lists are restyled here. */}
      <div className="katex-left no-math-copy prose dark:prose-invert text-foreground max-w-none *:first:mt-0 *:last:mb-0 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </Reveal>
  );
}
