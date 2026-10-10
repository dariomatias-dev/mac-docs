"use client";

import { ChevronDown, TextAlignStart } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import type { TocItem } from "../lib/extract-toc";

export function MobileToc({ items, label = "Neste artigo" }: { items: TocItem[]; label?: string }) {
  const { open, setOpen, toggle } = useDisclosure();
  if (items.length === 0) return null;

  return (
    <div className="border-border bg-surface/60 rounded-card mb-8 overflow-hidden border xl:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="text-foreground flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <TextAlignStart className="text-muted h-4 w-4" aria-hidden="true" />
          {label}
        </span>
        <ChevronDown
          className={`text-muted h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="border-border bg-background border-t px-2 py-2">
          {items.map((item) => (
            <li key={item.id} className={item.depth === 3 ? "pl-4" : undefined}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="text-muted-2 hover:bg-surface hover:text-foreground rounded-control block px-3 py-2 text-sm transition-colors"
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
