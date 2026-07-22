"use client";

import { useMemo } from "react";

import katex from "katex";

export function Katex({ expr }: { expr: string }) {
  const html = useMemo(
    () => katex.renderToString(expr, { throwOnError: false, displayMode: true }),
    [expr],
  );

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
