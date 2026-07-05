import Link from "next/link";

import type { Crumb } from "../navigation.types";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted flex flex-wrap items-center gap-1.5 text-[0.8rem] font-semibold tracking-wide"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">›</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-accent transition-colors">
              {item.title}
            </Link>
          ) : (
            <span>{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
