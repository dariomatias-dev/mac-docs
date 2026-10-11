"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

import type { SidebarGroup } from "../navigation.types";

/** Shared look of the current page/group in the sidebar. */
export const ACTIVE_ITEM = "bg-accent/12 text-accent-dark dark:text-accent font-semibold";

export function isPathInGroup(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GroupNav({ group, depth = 0 }: { group: SidebarGroup; depth?: number }) {
  const pathname = usePathname();
  const { close } = useSidebarMobile();
  const isActiveBranch = isPathInGroup(pathname, group.href);
  // Ignore persisted `sidebar-groups`: hydrating stored `true` reopens
  // modules above the current page after the first paint and pushes the
  // active link out of the nav. Session pin + pathname-keyed collapse only.
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [collapsedPath, setCollapsedPath] = useState<string | null>(null);
  const [animatedPath, setAnimatedPath] = useState<string | null>(null);
  const open = collapsedPath === pathname ? false : isActiveBranch || pinnedOpen;
  const animate = animatedPath === pathname;

  const groupActive = pathname === group.href;
  const hasChildren = group.pages.length > 0 || group.groups.length > 0;

  return (
    <div>
      <div
        className={`group/nav rounded-control flex items-center transition-colors ${
          groupActive ? ACTIVE_ITEM : "hover:bg-surface-2"
        }`}
      >
        <Link
          href={group.href}
          onClick={close}
          aria-current={groupActive ? "page" : undefined}
          className={`rounded-control min-w-0 flex-1 px-3.5 leading-snug transition-colors ${
            depth === 0 ? "py-2.5 text-[0.9375rem]" : "py-2 text-sm"
          } ${
            groupActive
              ? ""
              : isActiveBranch
                ? "text-foreground font-semibold"
                : depth === 0
                  ? "text-foreground font-medium"
                  : "text-muted-2 group-hover/nav:text-foreground font-medium"
          }`}
        >
          {group.title}
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-label={open ? "Recolher seção" : "Expandir seção"}
            aria-expanded={open}
            onClick={() => {
              const next = !open;
              setAnimatedPath(pathname);
              setCollapsedPath(next ? null : pathname);
              setPinnedOpen(next);
            }}
            className="text-muted-2 hover:bg-border hover:text-foreground rounded-control mr-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center transition-colors"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        // `inert` keeps links in a collapsed group out of the tab order and
        // the accessibility tree while the height transition still runs.
        <div
          inert={!open}
          className={`grid ${
            animate ? "transition-[grid-template-rows,opacity] duration-200 ease-out" : ""
          } ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-border-strong my-1 ml-3.5 border-l pl-2">
              {group.pages.length > 0 && (
                <ul className="space-y-0.5">
                  {group.pages.map((page) => {
                    const active = pathname === page.href;
                    return (
                      <li key={page.href} className="relative">
                        {active && (
                          <span
                            aria-hidden="true"
                            className="bg-accent absolute top-2 bottom-2 left-[-9.5px] w-0.5 rounded-full"
                          />
                        )}
                        <Link
                          href={page.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={`rounded-control block px-3.5 py-2 text-sm leading-snug transition-colors ${
                            active
                              ? ACTIVE_ITEM
                              : "text-muted-2 hover:bg-surface-2 hover:text-foreground"
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
                <div className="space-y-0.5">
                  {group.groups.map((sub) => (
                    <GroupNav key={sub.href} group={sub} depth={depth + 1} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
