import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import { SidebarGroupsProvider } from "../../providers/sidebar-groups-provider";
import { GroupNav } from "../group-nav";

import type { SidebarGroup } from "../../navigation.types";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));

function renderGroup(group: SidebarGroup) {
  return render(
    <ActiveMobileSheetProvider>
      <SidebarGroupsProvider>
        <GroupNav group={group} />
      </SidebarGroupsProvider>
    </ActiveMobileSheetProvider>,
  );
}

const leafGroup: SidebarGroup = {
  title: "Matrizes",
  slug: ["matrizes"],
  href: "/docs/matrizes",
  order: 0,
  pages: [
    {
      title: "Operações",
      slug: ["matrizes", "operacoes"],
      href: "/docs/matrizes/operacoes",
      order: 0,
    },
    {
      title: "Determinantes",
      slug: ["matrizes", "determinantes"],
      href: "/docs/matrizes/determinantes",
      order: 1,
    },
  ],
  groups: [],
};

describe("GroupNav", () => {
  beforeEach(() => {
    localStorage.clear();
    usePathnameMock.mockReturnValue("/docs/other");
  });

  it("starts collapsed when the active branch is elsewhere", () => {
    // The children stay in the DOM either way (collapse is a CSS
    // max-height/opacity transition, not conditional rendering), so the
    // toggle button's own label is the real signal of open/closed state.
    renderGroup(leafGroup);
    expect(screen.getByRole("button", { name: "Expandir seção" })).toBeInTheDocument();
  });

  it("starts expanded when the current page is inside this branch", () => {
    usePathnameMock.mockReturnValue("/docs/matrizes/operacoes");
    renderGroup(leafGroup);
    expect(screen.getByRole("button", { name: "Recolher seção" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Operações" })).toBeInTheDocument();
  });

  it("marks the current page's link with aria-current", () => {
    usePathnameMock.mockReturnValue("/docs/matrizes/operacoes");
    renderGroup(leafGroup);
    expect(screen.getByRole("link", { name: "Operações" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Determinantes" })).not.toHaveAttribute("aria-current");
  });

  it("toggles open and closed on click", async () => {
    renderGroup(leafGroup);
    const toggleButton = screen.getByRole("button", { name: "Expandir seção" });

    await userEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: "Recolher seção" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Recolher seção" }));
    expect(screen.getByRole("button", { name: "Expandir seção" })).toBeInTheDocument();
  });

  it("remembers a manually collapsed state across remounts, even for the active branch", async () => {
    usePathnameMock.mockReturnValue("/docs/matrizes/operacoes");
    const { unmount } = renderGroup(leafGroup);
    await userEvent.click(screen.getByRole("button", { name: "Recolher seção" }));
    unmount();

    renderGroup(leafGroup);
    expect(screen.getByRole("button", { name: "Expandir seção" })).toBeInTheDocument();
  });

  it("renders no toggle button for a group with no pages or subgroups", () => {
    renderGroup({ ...leafGroup, pages: [], groups: [] });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders nested subgroups recursively", () => {
    usePathnameMock.mockReturnValue("/docs/parent/child");
    renderGroup({
      title: "Pai",
      slug: ["parent"],
      href: "/docs/parent",
      order: 0,
      pages: [],
      groups: [
        {
          title: "Filho",
          slug: ["parent", "child"],
          href: "/docs/parent/child",
          order: 0,
          pages: [
            {
              title: "Folha",
              slug: ["parent", "child", "leaf"],
              href: "/docs/parent/child/leaf",
              order: 0,
            },
          ],
          groups: [],
        },
      ],
    });

    expect(screen.getByRole("link", { name: "Filho" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Folha" })).toBeInTheDocument();
  });
});
