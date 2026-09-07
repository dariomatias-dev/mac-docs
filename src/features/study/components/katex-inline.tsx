"use client";

import katex from "katex";
import { useMemo } from "react";

export function Katex({ expr }: { expr: string }) {
  const html = useMemo(
    () => katex.renderToString(expr, { throwOnError: false, displayMode: true }),
    [expr],
  );

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
