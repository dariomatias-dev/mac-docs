"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Check, Copy } from "lucide-react";

import { useCopy } from "@/shared/hooks/use-copy";

type Target = { host: HTMLElement; latex: string };

// KaTeX (htmlAndMathml) embeds the original TeX in a MathML
// `<annotation encoding="application/x-tex">`. Read it back so a copy button
// yields real LaTeX source instead of the rendered glyphs.
function latexOf(display: Element): string | null {
  const annotation = display.querySelector('annotation[encoding="application/x-tex"]');
  return annotation?.textContent?.trim() || null;
}

function MathCopyButton({ latex }: { latex: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(latex)}
      aria-label={copied ? "Copiado" : "Copiar LaTeX"}
      className="border-border bg-background text-muted hover:border-accent hover:text-accent absolute top-1.5 right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function MathCopy() {
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    const found: Target[] = [];

    document.querySelectorAll<HTMLElement>(".katex-display").forEach((display) => {
      // Guard against React strict-mode double-invoke and re-renders.
      if (display.dataset.mathCopy) return;
      // Skip intermediate working steps (Proof/Resolution); only the
      // final answer is worth a copy button.
      if (display.closest(".no-math-copy")) return;
      const latex = latexOf(display);
      if (!latex) return;

      display.dataset.mathCopy = "true";
      display.classList.add("group", "relative");
      const host = document.createElement("span");
      display.appendChild(host);
      found.push({ host, latex });
    });

    // Defer out of the effect body: the host nodes exist in the DOM now, and
    // deferring keeps setState off the synchronous effect path.
    const raf = requestAnimationFrame(() => setTargets(found));

    return () => {
      cancelAnimationFrame(raf);
      for (const { host } of found) {
        delete host.parentElement?.dataset.mathCopy;
        host.remove();
      }
    };
  }, []);

  return (
    <>
      {targets.map(({ host, latex }, i) =>
        createPortal(<MathCopyButton latex={latex} />, host, String(i)),
      )}
    </>
  );
}
