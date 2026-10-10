"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HEADER_LINKS } from "../lib/header-links";

/** Desktop header links; below `lg` they move into HeaderOverflowMenu. */
export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="ml-6 hidden items-center gap-6 lg:flex">
      {HEADER_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:bottom-[-1.3rem] after:h-0.5 after:rounded-full after:transition-colors ${
              active
                ? "text-foreground after:bg-accent"
                : "text-muted hover:text-foreground after:bg-transparent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
