"use client";

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
    <nav aria-label="Índice do artigo" className="text-sm">
      <div className="border-border border-l pl-6">
        <p className="text-foreground mb-3 font-semibold">{label}</p>

        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li
                key={item.id}
                className="relative"
                style={{ paddingLeft: item.depth === 3 ? "0.75rem" : "0" }}
              >
                {active && (
                  <span
                    className="bg-accent absolute top-1 bottom-1 -left-6.5 w-0.5 rounded-full"
                    aria-hidden="true"
                  />
                )}
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  className={`block rounded-[14px] px-4 py-2.5 text-[0.8rem] leading-snug transition-colors ${
                    active
                      ? "bg-accent-soft text-accent font-semibold"
                      : "text-muted-2 hover:bg-surface hover:text-accent"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
