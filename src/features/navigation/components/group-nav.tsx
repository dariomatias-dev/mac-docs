"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ChevronRight } from "lucide-react";

import type { SidebarGroup } from "../navigation.types";
import { useSidebarGroups } from "../providers/sidebar-groups-provider";
import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

export function GroupNav({ group, depth = 0 }: { group: SidebarGroup; depth?: number }) {
  const pathname = usePathname();
  const { close } = useSidebarMobile();
  const { isOpen, setGroupOpen, seedGroupOpen } = useSidebarGroups();
  const isActiveBranch = pathname.startsWith(group.href);
  const open = isOpen(group.href, isActiveBranch);

  useEffect(() => {
    seedGroupOpen(group.href, isActiveBranch);
  }, [seedGroupOpen, group.href, isActiveBranch]);

  // Navigating into this branch (e.g. via prev/next) forces it open so the
  // active page is visible, even if the group was previously collapsed.
  useEffect(() => {
    if (isActiveBranch) setGroupOpen(group.href, true);
  }, [setGroupOpen, group.href, isActiveBranch]);

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
