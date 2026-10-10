"use client";

import { Menu } from "lucide-react";

import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

export function MobileMenuButton() {
  const { open, toggle } = useSidebarMobile();

  return (
    <button
      type="button"
      aria-label="Abrir menu"
      aria-expanded={open}
      onClick={toggle}
      className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex h-9 w-9 cursor-pointer items-center justify-center transition-colors md:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
