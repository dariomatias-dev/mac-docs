"use client";

import { ArrowUp, TextAlignStart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useRafScroll } from "@/shared/hooks/use-raf-scroll";

import { READING_LINE, activeHeadingId, type HeadingTop } from "../lib/active-heading";

import type { TocItem } from "../lib/extract-toc";

export function TableOfContents({
  items,
  label = "Neste artigo",
}: {
  items: TocItem[];
  label?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLElement>(null);
  // Hash clicks use CSS `scroll-smooth`. Until the page settles, the spy
  // reports every heading on the way — without a pin the TOC would chase
  // them (jump to the top, then back down to the target).
  const pinnedId = useRef<string | null>(null);
  const settleRef = useRef(0);

  useEffect(() => () => window.clearTimeout(settleRef.current), []);

  useRafScroll(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => {
        const el = document.getElementById(item.id);
        return el ? { id: item.id, top: el.getBoundingClientRect().top } : null;
      })
      .filter((h): h is HeadingTop => h !== null);
    const current = activeHeadingId(headings, {
      viewportBottom: window.innerHeight + window.scrollY,
      documentBottom: document.documentElement.scrollHeight,
      readingLine: READING_LINE,
    });
    if (!current) return;

    if (pinnedId.current && pinnedId.current !== current) {
      window.clearTimeout(settleRef.current);
      settleRef.current = window.setTimeout(() => {
        // Keep the clicked entry; the last spy frame is often 1–2 headings
        // behind because a short final section never crosses the reading line.
        pinnedId.current = null;
      }, 150);
      return;
    }
    pinnedId.current = null;
    setActiveId((id) => (id === current ? id : current));
  }, [items]);

  useEffect(() => {
    if (pinnedId.current) return;

    const scroller = scrollRef.current;
    if (!scroller) return;

    const active = scroller.querySelector<HTMLElement>('[aria-current="location"]');
    if (!active) return;

    const c = scroller.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    if (a.height === 0) return;
    if (a.top < c.top) scroller.scrollTop += a.top - c.top;
    else if (a.bottom > c.bottom) scroller.scrollTop += a.bottom - c.bottom;
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <nav
      ref={scrollRef}
      aria-label="Índice do artigo"
      className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-6 text-[0.8125rem]"
    >
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
                onClick={() => {
                  pinnedId.current = item.id;
                  setActiveId(item.id);
                }}
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
        onClick={() => {
          const first = items[0]?.id ?? null;
          pinnedId.current = first;
          setActiveId(first);
        }}
        className="text-muted hover:text-foreground mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar ao topo
      </a>
    </nav>
  );
}
