"use client";

import { Check, Copy } from "lucide-react";

import { useCopy } from "@/shared/hooks/use-copy";

/**
 * Copies one exercise or question as Markdown (statement, answers and math
 * as LaTeX), ready to paste into an AI chat and ask about it. The text is
 * built at compile time by the content feature's remark-exercise-markdown.
 */
export function CopyMarkdownButton({ markdown, noun }: { markdown: string; noun: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => void copy(markdown)}
      aria-label={copied ? "Copiado" : `Copiar ${noun} em Markdown`}
      title={`Copiar ${noun} em Markdown, para colar numa IA e tirar dúvidas`}
      className="text-muted hover:text-foreground rounded-control inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-2 py-1 text-xs font-medium transition-colors print:hidden"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
