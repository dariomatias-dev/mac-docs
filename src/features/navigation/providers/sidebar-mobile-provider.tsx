"use client";

import { useMobileSheet } from "@/shared/providers/active-mobile-sheet-provider";

export function useSidebarMobile() {
  const { isOpen, close, toggle } = useMobileSheet("nav");

  return { open: isOpen, toggle, close };
}
