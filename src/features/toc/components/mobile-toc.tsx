"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import type { TocItem } from "../lib/extract-toc";

export function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className="border-border mt-6 overflow-hidden rounded-xl border xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-foreground flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold"
      >
        Neste artigo
        <ChevronDown
          className={`text-muted h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="border-border border-t px-2 py-2">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "1rem" : "0" }}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="text-muted-2 hover:bg-surface hover:text-accent block rounded-lg px-3 py-2 text-sm transition-colors"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
