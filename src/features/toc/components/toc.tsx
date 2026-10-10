"use client";

import { ArrowUp, TextAlignStart } from "lucide-react";
import { useState } from "react";

import { useRafScroll } from "@/shared/hooks/use-raf-scroll";

import type { TocItem } from "../lib/extract-toc";

export function TableOfContents({
  items,
  label = "Neste artigo",
}: {
  items: TocItem[];
  label?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useRafScroll(() => {
    if (items.length === 0) return;

    const OFFSET = 120;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      setActiveId(headings[headings.length - 1].id);
      return;
    }

    let current = headings[0].id;
    for (const el of headings) {
      if (el.getBoundingClientRect().top <= OFFSET) current = el.id;
      else break;
    }
    setActiveId(current);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Índice do artigo" className="text-[0.8125rem]">
      <p className="text-foreground mb-3 flex items-center gap-2 text-xs font-semibold">
        <TextAlignStart className="text-muted h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>

      <ul className="border-border border-l">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors ${
                  item.depth === 3 ? "pl-7" : "pl-4"
                } ${
                  active
                    ? "border-accent text-accent font-medium"
                    : "text-muted hover:border-border-strong hover:text-foreground border-transparent"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href="#top"
        className="text-muted hover:text-foreground mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar ao topo
      </a>
    </nav>
  );
}
