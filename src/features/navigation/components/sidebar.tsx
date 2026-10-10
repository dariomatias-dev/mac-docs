"use client";

import { NotebookPen, PanelLeftClose, PanelLeftOpen, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";

import { ThemeToggle } from "@/features/theme";
import { REPO_URL } from "@/shared/lib/repo";

import { GitHubLink } from "./github-link";
import { ACTIVE_ITEM, GroupNav } from "./group-nav";
import { Logo } from "./logo";
import { useSidebarCollapse } from "../providers/sidebar-collapse-provider";
import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

import type { SidebarCourse } from "../navigation.types";
import type { ReactNode } from "react";

/**
 * Splits a course into the sidebar's three blocks, keeping content order:
 * course material that comes before the first subject (the course plan)
 * stays on top, subjects form "Conteúdo", and the remaining material
 * (assessments, loose pages) goes under "Recursos".
 */
function splitCourse(course: SidebarCourse) {
  const firstModule = course.groups.findIndex((group) => group.kind === "module");
  const cut = firstModule === -1 ? course.groups.length : firstModule;
  return {
    leading: course.groups.slice(0, cut).filter((group) => group.kind === "resource"),
    modules: course.groups.filter((group) => group.kind === "module"),
    trailing: course.groups.slice(cut).filter((group) => group.kind === "resource"),
  };
}

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="mt-6">
      <p
        id={id}
        className="text-muted-2 px-3.5 pb-2 text-xs font-semibold tracking-[0.06em] uppercase"
      >
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

const FOOTER_LINKS = [
  { href: "/anotacoes", label: "Anotações", Icon: NotebookPen },
  { href: "/contribuidores", label: "Contribuidores", Icon: Users },
];

/**
 * Full-height docs sidebar: brand, controls and search on top, the course
 * outline in the middle, site links at the bottom (the docs have no top
 * header on desktop). Below `md` it becomes a slide-in drawer; collapsed on
 * desktop it shrinks to a slim rail that reopens it.
 */
export function Sidebar({ tree, search }: { tree: SidebarCourse[]; search?: ReactNode }) {
  const { open, close } = useSidebarMobile();
  const { collapsed, toggle } = useSidebarCollapse();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement>(null);

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

  const pageLink = (href: string, title: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={close}
        aria-current={active ? "page" : undefined}
        className={`rounded-control block px-3.5 py-2.5 text-[0.9375rem] leading-snug transition-colors ${
          active ? ACTIVE_ITEM : "text-foreground hover:bg-surface-2 font-medium"
        }`}
      >
        {title}
      </Link>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={close}
        tabIndex={-1}
        aria-hidden="true"
        className={`bg-foreground/25 fixed inset-0 z-50 block cursor-default appearance-none border-0 p-0 backdrop-blur-[2px] transition-opacity duration-300 md:hidden print:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`border-border bg-surface fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-80 flex-col overflow-hidden border-r transition-[translate,box-shadow] duration-300 ease-in-out md:z-30 md:max-w-none md:translate-x-0 md:shadow-none md:transition-[width] print:hidden ${
          open ? "shadow-lift translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-14" : "md:w-72 lg:w-80"}`}
      >
        {collapsed && (
          <div className="hidden flex-1 flex-col items-center py-3 md:flex">
            <button
              type="button"
              onClick={toggle}
              aria-label="Abrir barra lateral"
              className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex h-9 w-9 cursor-pointer items-center justify-center transition-colors"
            >
              <PanelLeftOpen className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        <div className={`flex min-h-0 flex-1 flex-col ${collapsed ? "md:hidden" : ""}`}>
          <div className="flex h-16 shrink-0 items-center gap-1 pr-2 pl-5">
            <Logo />
            <div className="ml-auto flex items-center">
              <ThemeToggle />
              <GitHubLink href={REPO_URL} />
              {!collapsed && (
                <button
                  type="button"
                  aria-label="Recolher barra lateral"
                  onClick={toggle}
                  className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center transition-colors md:flex"
                >
                  <PanelLeftClose className="h-4.5 w-4.5" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Fechar menu"
                className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex h-9 w-9 cursor-pointer items-center justify-center transition-colors md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {search && <div className="shrink-0 px-4 pb-3">{search}</div>}

          <nav
            ref={scrollRef}
            aria-label="Material"
            className="flex-1 overflow-y-auto overscroll-contain mask-[linear-gradient(to_bottom,black_calc(100%-2rem),transparent)] px-3 pt-1 pb-10"
          >
            {tree.map((course) => {
              const { leading, modules, trailing } = splitCourse(course);
              return (
                <div
                  key={course.slug.join("/")}
                  className="border-border mt-6 border-t pt-4 first:mt-0 first:border-t-0 first:pt-0"
                >
                  <div className="space-y-0.5">
                    {pageLink(course.href, course.title)}
                    {leading.map((group) => (
                      <GroupNav key={group.href} group={group} />
                    ))}
                  </div>

                  {modules.length > 0 && (
                    <NavSection label="Conteúdo">
                      {modules.map((group) => (
                        <GroupNav key={group.href} group={group} />
                      ))}
                    </NavSection>
                  )}

                  {(trailing.length > 0 || course.pages.length > 0) && (
                    <NavSection label="Recursos">
                      {trailing.map((group) => (
                        <GroupNav key={group.href} group={group} />
                      ))}
                      {course.pages.map((page) => pageLink(page.href, page.title))}
                    </NavSection>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="border-border flex shrink-0 items-center gap-1 border-t px-2 py-2">
            {FOOTER_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex flex-1 items-center justify-center gap-2 px-2.5 py-2 text-[0.8125rem] font-medium transition-colors"
              >
                <Icon className="text-muted h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
