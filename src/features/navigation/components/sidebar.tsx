"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import type { SidebarCourse } from "../navigation.types";
import { useSidebarCollapse } from "../providers/sidebar-collapse-provider";
import { useSidebarMobile } from "../providers/sidebar-mobile-provider";
import { GroupNav } from "./group-nav";

export function Sidebar({ tree }: { tree: SidebarCourse[] }) {
  const { open, close } = useSidebarMobile();
  const { collapsed, toggle } = useSidebarCollapse();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!container || !active) return;

    const c = container.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    if (a.top < c.top || a.bottom > c.bottom) {
      container.scrollTop += a.top - c.top - (container.clientHeight - a.height) / 2;
    }
  }, [pathname]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`bg-background/60 fixed inset-0 top-16 z-50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        onClick={collapsed ? toggle : undefined}
        role={collapsed ? "button" : undefined}
        aria-label={collapsed ? "Abrir barra lateral" : undefined}
        className={`group/side border-border bg-background fixed top-16 bottom-0 left-0 z-50 flex w-[86vw] max-w-85 flex-col overflow-hidden border-r shadow-2xl transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:max-w-none md:shrink-0 md:translate-x-0 md:shadow-none md:transition-[width] ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:hover:bg-surface md:w-14 md:cursor-pointer" : "md:w-95 lg:w-105"}`}
      >
        <div
          className={`text-muted group-hover/side:text-accent hidden flex-1 items-center justify-center transition-colors ${
            collapsed ? "md:flex" : ""
          }`}
          aria-hidden={!collapsed}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </div>

        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto pt-7 pr-7 pb-4 pl-6 md:py-4 md:pr-9 md:pl-2 ${
            collapsed ? "md:hidden" : ""
          }`}
        >
          {tree.map((course) => (
            <div
              key={course.slug.join("/")}
              className="border-border mt-6 border-t pt-6 first:mt-0 first:border-t-0 first:pt-0"
            >
              <p className="text-muted-2 mb-2 px-4 text-xs font-semibold tracking-wide uppercase">
                {course.title}
              </p>
              {course.groups.map((group) => (
                <GroupNav key={group.href} group={group} />
              ))}
            </div>
          ))}
        </div>

        {!collapsed && (
          <button
            type="button"
            aria-label="Recolher barra lateral"
            onClick={toggle}
            className="border-border text-muted hover:bg-surface hover:text-accent hidden cursor-pointer items-center justify-center border-t px-4 py-3 transition-colors md:flex"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </aside>

      <div
        aria-hidden="true"
        className={`bg-border fixed inset-x-0 top-16 z-60 h-px transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
