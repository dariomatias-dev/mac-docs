"use client";

import { type ComponentPropsWithoutRef, createElement, useState } from "react";

import { Check, Pilcrow } from "lucide-react";

type HeadingLevel = 2 | 3 | 4;

type HeadingAnchorProps = ComponentPropsWithoutRef<"h2"> & {
  level: HeadingLevel;
};

// Heading with a hover-revealed pilcrow that copies a deep link to the section
// (react.dev / Fumadocs pattern). rehype-slug provides the `id`.
export function HeadingAnchor({ level, id, children, className, ...props }: HeadingAnchorProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!id) return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    void navigator.clipboard?.writeText(url);
    history.replaceState(null, "", `#${id}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return createElement(
    `h${level}`,
    { id, className: ["group scroll-mt-28", className].filter(Boolean).join(" "), ...props },
    children,
    id ? (
      <button
        key="anchor"
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copiado" : "Copiar link da seção"}
        className="text-muted hover:text-accent ml-2 inline-flex translate-y-[0.05em] cursor-pointer align-middle opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? (
          <Check className="h-[0.8em] w-[0.8em]" />
        ) : (
          <Pilcrow className="h-[0.8em] w-[0.8em]" />
        )}
      </button>
    ) : null,
  );
}
