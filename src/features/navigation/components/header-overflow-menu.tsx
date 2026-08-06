"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MoreVertical, NotebookPen, Users } from "lucide-react";

const links = [
  { href: "/anotacoes", label: "Anotações", Icon: NotebookPen },
  { href: "/contribuidores", label: "Contribuidores", Icon: Users },
];

/**
 * Header dropdown rendered only below the `sm` breakpoint, where there is no
 * room for the Anotações and Contribuidores links.
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
    <div ref={containerRef} className="relative sm:hidden">
      <button
        type="button"
        aria-label="Mais opções"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="text-muted-2 hover:text-accent flex h-6 w-6 cursor-pointer items-center justify-center transition-colors"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div
          role="menu"
          className="border-border bg-background absolute top-full right-0 mt-3 w-48 overflow-hidden rounded-xl border shadow-lg"
        >
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-accent-soft text-accent"
                  : "text-foreground hover:bg-surface hover:text-accent"
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
