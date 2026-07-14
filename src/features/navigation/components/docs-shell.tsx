"use client";

import type { ReactNode } from "react";

import type { SidebarCourse } from "../navigation.types";
import { useSidebarCollapse } from "../providers/sidebar-collapse-provider";
import { Sidebar } from "./sidebar";

export function DocsShell({ tree, children }: { tree: SidebarCourse[]; children: ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <div className="flex w-full flex-1">
      <Sidebar tree={tree} />
      <div className={`min-w-0 flex-1 ${collapsed ? "md:ml-14" : "md:ml-95 lg:ml-105"}`}>
        {children}
      </div>
    </div>
  );
}
