"use client";

import { useEffect } from "react";

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M20 6 9 17l-5-5"/></svg>`;

const BTN_CLASS =
  "math-copy-btn border-border bg-background text-muted hover:border-accent hover:text-accent absolute top-1.5 right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100";

// KaTeX (htmlAndMathml) embeds the original TeX in a MathML
// `<annotation encoding="application/x-tex">`. Read it back so a copy button
// yields real LaTeX source instead of the rendered glyphs.
function latexOf(display: Element): string | null {
  const annotation = display.querySelector('annotation[encoding="application/x-tex"]');
  return annotation?.textContent?.trim() || null;
}

export function MathCopy() {
  useEffect(() => {
    const displays = document.querySelectorAll<HTMLElement>(".katex-display");
    const timers = new Set<ReturnType<typeof setTimeout>>();

    for (const display of displays) {
      // Guard against React strict-mode double-invoke and re-renders.
      if (display.querySelector(":scope > .math-copy-btn")) continue;
      const latex = latexOf(display);
      if (!latex) continue;

      display.classList.add("group", "relative");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = BTN_CLASS;
      btn.setAttribute("aria-label", "Copiar LaTeX");
      btn.innerHTML = COPY_ICON;

      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(latex);
        } catch {
          return;
        }
        btn.innerHTML = CHECK_ICON;
        btn.setAttribute("aria-label", "Copiado");
        const timer = setTimeout(() => {
          btn.innerHTML = COPY_ICON;
          btn.setAttribute("aria-label", "Copiar LaTeX");
          timers.delete(timer);
        }, 1500);
        timers.add(timer);
      });

      display.appendChild(btn);
    }

    return () => {
      for (const timer of timers) clearTimeout(timer);
      document.querySelectorAll(".math-copy-btn").forEach((btn) => btn.remove());
    };
  }, []);

  return null;
}
