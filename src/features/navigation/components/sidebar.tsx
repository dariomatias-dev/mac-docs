"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import type { SidebarCourse, SidebarGroup } from "../navigation.types";
import { useSidebarCollapse } from "../providers/sidebar-collapse-provider";
import { useSidebarGroups } from "../providers/sidebar-groups-provider";
import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

function GroupNav({ group, depth = 0 }: { group: SidebarGroup; depth?: number }) {
  const pathname = usePathname();
  const { close } = useSidebarMobile();
  const { isOpen, setGroupOpen, seedGroupOpen } = useSidebarGroups();
  const isActiveBranch = pathname.startsWith(group.href);
  const open = isOpen(group.href, isActiveBranch);

  useEffect(() => {
    seedGroupOpen(group.href, isActiveBranch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupActive = pathname === group.href;

  return (
    <div className={depth === 0 ? "mb-6" : "mb-1"}>
      <div
        className={`group/nav flex items-center rounded-[14px] transition-colors ${
          groupActive
            ? "bg-accent-soft text-accent font-semibold"
            : "text-foreground hover:bg-surface font-semibold"
        }`}
      >
        <Link
          href={group.href}
          onClick={close}
          aria-current={groupActive ? "page" : undefined}
          className={`flex-1 px-4 py-3 text-[0.9rem] transition-colors ${
            groupActive ? "" : "group-hover/nav:text-accent"
          }`}
        >
          {group.title}
        </Link>
        <button
          type="button"
          aria-label={open ? "Recolher seção" : "Expandir seção"}
          onClick={() => setGroupOpen(group.href, !open)}
          className={`cursor-pointer px-4 py-2 transition-colors ${
            groupActive ? "text-accent" : "text-muted group-hover/nav:text-accent"
          }`}
        >
          <ChevronRight
            className={`h-4.5 w-4.5 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {group.pages.length > 0 && (
          <ul className="space-y-0.5 py-0.5 pl-3">
            {group.pages.map((page) => {
              const active = pathname === page.href;
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-[14px] px-4 py-3 text-[0.9rem] transition-colors ${
                      active
                        ? "bg-accent-soft text-accent font-semibold"
                        : "text-muted-2 hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {group.groups.length > 0 && (
          <div className="py-0.5 pl-3">
            {group.groups.map((sub) => (
              <GroupNav key={sub.href} group={sub} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ tree }: { tree: SidebarCourse[] }) {
  const { open } = useSidebarMobile();
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
    <aside
      onClick={collapsed ? toggle : undefined}
      role={collapsed ? "button" : undefined}
      aria-label={collapsed ? "Abrir barra lateral" : undefined}
      className={`group/side ${
        open ? "flex" : "hidden"
      } border-border bg-background fixed inset-x-0 top-28 bottom-0 z-30 flex-col overflow-hidden border-b transition-[width] duration-300 ease-in-out md:sticky md:top-16 md:flex md:h-[calc(100vh-4rem)] md:shrink-0 md:border-r md:border-b-0 ${
        collapsed ? "md:hover:bg-surface md:w-14 md:cursor-pointer" : "md:w-95 lg:w-105"
      }`}
    >
      {collapsed ? (
        <div className="text-muted group-hover/side:text-accent hidden flex-1 items-center justify-center transition-colors md:flex">
          <PanelLeftOpen className="h-5 w-5" />
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto py-4 pr-7 pl-6 md:w-95 md:pr-9 md:pl-2 lg:w-105"
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

          <button
            type="button"
            aria-label="Recolher barra lateral"
            onClick={toggle}
            className="border-border text-muted hover:bg-surface hover:text-accent hidden cursor-pointer items-center justify-center border-t px-4 py-3 transition-colors md:flex"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </>
      )}
    </aside>
  );
}
