"use client";

import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HEADER_LINKS } from "../lib/header-links";

/**
 * Header dropdown rendered only below the `lg` breakpoint, where there is no
 * room for the Anotações and Contribuidores links (they need `lg`, alongside
 * the search bar, to avoid overlapping it).
 */
export function HeaderOverflowMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label="Mais opções"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex h-9 w-9 cursor-pointer items-center justify-center transition-colors"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div
          role="menu"
          className="border-border bg-background shadow-lift rounded-card absolute top-full right-0 mt-2 w-52 overflow-hidden border p-1.5"
        >
          {HEADER_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`rounded-control flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-accent-soft text-accent"
                  : "text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
