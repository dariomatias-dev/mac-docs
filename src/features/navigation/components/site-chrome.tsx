"use client";

import { usePathname } from "next/navigation";

import type { ReactNode } from "react";

/**
 * Renders the site-wide header/footer everywhere except under /docs, which
 * brings its own chrome (full-height sidebar on desktop, compact bar on
 * mobile) so the reading column starts at the top of the window.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/docs")) return null;
  return children;
}
