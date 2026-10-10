"use client";

import { ThemeToggle } from "@/features/theme";

import { Logo } from "./logo";
import { MobileMenuButton } from "./mobile-menu-button";
import { Sidebar } from "./sidebar";
import { useSidebarCollapse } from "../providers/sidebar-collapse-provider";

import type { SidebarCourse } from "../navigation.types";
import type { ReactNode } from "react";

export function DocsShell({
  tree,
  search,
  searchMobile,
  children,
}: {
  tree: SidebarCourse[];
  /** Search field shown at the top of the sidebar. */
  search?: ReactNode;
  /** Compact search trigger for the mobile bar. */
  searchMobile?: ReactNode;
  children: ReactNode;
}) {
  const { collapsed } = useSidebarCollapse();

  return (
    <div className="flex w-full flex-1">
      <Sidebar tree={tree} search={search} />
      <div className={`min-w-0 flex-1 print:ml-0 ${collapsed ? "md:ml-14" : "md:ml-72 lg:ml-80"}`}>
        <div className="border-border bg-background/90 sticky top-0 z-40 flex h-14 items-center gap-1 border-b px-2 backdrop-blur-md md:hidden print:hidden">
          <MobileMenuButton />
          <div className="ml-1">
            <Logo className="h-5.5" />
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            {/* Wrapped on its own: an element created by the server layout
                sitting in a sibling array trips React's missing-key check. */}
            {searchMobile && <div className="flex">{searchMobile}</div>}
            <ThemeToggle />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
