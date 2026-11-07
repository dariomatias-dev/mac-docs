import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ActiveMobileSheetProvider,
  useMobileSheet,
} from "@/shared/providers/active-mobile-sheet-provider";

import { SidebarCollapseProvider } from "../../providers/sidebar-collapse-provider";
import { SidebarGroupsProvider } from "../../providers/sidebar-groups-provider";
import { Sidebar } from "../sidebar";

import type { SidebarCourse } from "../../navigation.types";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));

const tree: SidebarCourse[] = [
  {
    title: "Matemática Discreta",
    slug: ["matematica-discreta"],
    href: "/docs/matematica-discreta",
    order: 0,
    pages: [
      {
        title: "Plano de disciplina",
        slug: ["matematica-discreta", "plano"],
        href: "/docs/matematica-discreta/plano",
        order: 0,
      },
      {
        title: "Segunda página",
        slug: ["matematica-discreta", "segunda"],
        href: "/docs/matematica-discreta/segunda",
        order: 1,
      },
    ],
    groups: [
      {
        title: "Matrizes",
        description: undefined,
        slug: ["matematica-discreta", "matrizes"],
        href: "/docs/matematica-discreta/matrizes",
        order: 1,
        kind: "module",
        pages: [],
        groups: [],
      },
    ],
  },
];

function renderSidebar(sidebarTree = tree) {
  return render(
    <ActiveMobileSheetProvider>
      <SidebarCollapseProvider>
        <SidebarGroupsProvider>
          <Sidebar tree={sidebarTree} />
        </SidebarGroupsProvider>
      </SidebarCollapseProvider>
    </ActiveMobileSheetProvider>,
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    localStorage.clear();
    usePathnameMock.mockReturnValue("/docs/matematica-discreta/plano");
  });

  it("renders a link per course and page, marking the active one", () => {
    renderSidebar();

    const course = screen.getByRole("link", { name: /matemática discreta/i });
    expect(course).toHaveAttribute("href", "/docs/matematica-discreta");
    expect(course).not.toHaveAttribute("aria-current");

    const page = screen.getByRole("link", { name: "Plano de disciplina" });
    expect(page).toHaveAttribute("href", "/docs/matematica-discreta/plano");
    expect(page).toHaveAttribute("aria-current", "page");
  });

  it("renders a course's groups alongside its top-level pages", () => {
    renderSidebar();
    expect(screen.getByRole("link", { name: "Matrizes" })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/matrizes",
    );
  });

  it("starts expanded, with a visible collapse button", () => {
    renderSidebar();
    expect(screen.getByRole("button", { name: "Recolher barra lateral" })).toBeInTheDocument();
  });

  it("collapsing hides the collapse button and reveals the expand rail button", async () => {
    renderSidebar();
    await userEvent.click(screen.getByRole("button", { name: "Recolher barra lateral" }));

    expect(
      screen.queryByRole("button", { name: "Recolher barra lateral" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir barra lateral" })).toBeInTheDocument();
  });

  it("clicking the collapsed rail expands it back", async () => {
    renderSidebar();
    await userEvent.click(screen.getByRole("button", { name: "Recolher barra lateral" }));
    await userEvent.click(screen.getByRole("button", { name: "Abrir barra lateral" }));

    expect(screen.getByRole("button", { name: "Recolher barra lateral" })).toBeInTheDocument();
  });

  it("scrolls the active link into view when it sits outside the visible scroll area", () => {
    const { rerender } = renderSidebar();

    const container = document.querySelector<HTMLElement>('[class*="overflow-y-auto"]')!;
    const nextActiveLink = screen.getByRole("link", { name: "Segunda página" });

    container.getBoundingClientRect = () => ({ top: 0, bottom: 300, height: 300 }) as DOMRect;
    Object.defineProperty(container, "clientHeight", { value: 300, configurable: true });
    nextActiveLink.getBoundingClientRect = () => ({ top: 400, bottom: 440, height: 40 }) as DOMRect;

    usePathnameMock.mockReturnValue("/docs/matematica-discreta/segunda");
    rerender(
      <ActiveMobileSheetProvider>
        <SidebarCollapseProvider>
          <SidebarGroupsProvider>
            <Sidebar tree={tree} />
          </SidebarGroupsProvider>
        </SidebarCollapseProvider>
      </ActiveMobileSheetProvider>,
    );

    expect(container.scrollTop).not.toBe(0);
  });

  it("does not move the scrollbar while the active link is still collapsed", () => {
    const { rerender } = renderSidebar();

    const container = document.querySelector<HTMLElement>('[class*="overflow-y-auto"]')!;
    const nextActiveLink = screen.getByRole("link", { name: "Segunda página" });

    container.getBoundingClientRect = () => ({ top: 0, bottom: 300, height: 300 }) as DOMRect;
    Object.defineProperty(container, "clientHeight", { value: 300, configurable: true });
    nextActiveLink.getBoundingClientRect = () => ({ top: 400, bottom: 400, height: 0 }) as DOMRect;

    usePathnameMock.mockReturnValue("/docs/matematica-discreta/segunda");
    rerender(
      <ActiveMobileSheetProvider>
        <SidebarCollapseProvider>
          <SidebarGroupsProvider>
            <Sidebar tree={tree} />
          </SidebarGroupsProvider>
        </SidebarCollapseProvider>
      </ActiveMobileSheetProvider>,
    );

    expect(container.scrollTop).toBe(0);
  });

  it("clicking the mobile backdrop closes the open mobile sidebar", async () => {
    function OpenNavProbe() {
      const { isOpen, openSheet } = useMobileSheet("nav");
      return (
        <>
          <button onClick={openSheet}>abrir nav (teste)</button>
          <span data-testid="nav-state">{isOpen ? "open" : "closed"}</span>
        </>
      );
    }

    render(
      <ActiveMobileSheetProvider>
        <SidebarCollapseProvider>
          <SidebarGroupsProvider>
            <OpenNavProbe />
            <Sidebar tree={tree} />
          </SidebarGroupsProvider>
        </SidebarCollapseProvider>
      </ActiveMobileSheetProvider>,
    );

    await userEvent.click(screen.getByText("abrir nav (teste)"));
    expect(screen.getByTestId("nav-state")).toHaveTextContent("open");

    // The backdrop is a decorative, tabIndex={-1} click-catcher (aria-hidden),
    // so query it directly rather than by role/label.
    const backdrop = document.querySelector('button[aria-hidden="true"].fixed.inset-0');
    await userEvent.click(backdrop!);

    expect(screen.getByTestId("nav-state")).toHaveTextContent("closed");
  });

  it("separates leading material, modules, and trailing resources", () => {
    const subjectGroup = tree[0].groups[0];
    const leading = {
      ...subjectGroup,
      title: "Plano",
      href: "/docs/plano",
      kind: "resource" as const,
    };
    const trailing = {
      ...subjectGroup,
      title: "Avaliações",
      href: "/docs/avaliacoes",
      kind: "resource" as const,
    };
    renderSidebar([{ ...tree[0], groups: [leading, subjectGroup, trailing] }]);
    const content = screen.getByRole("group", { name: "Conteúdo" });
    const resources = screen.getByRole("group", { name: "Recursos" });
    expect(within(content).getByRole("link", { name: "Matrizes" })).toBeInTheDocument();
    expect(within(resources).getByRole("link", { name: "Avaliações" })).toBeInTheDocument();
    expect(
      within(resources).getByRole("link", { name: "Plano de disciplina" }),
    ).toBeInTheDocument();
    expect(content).not.toContainElement(screen.getByRole("link", { name: "Plano" }));
    expect(resources).not.toContainElement(screen.getByRole("link", { name: "Plano" }));
  });

  it("shows a resource-only course without empty section headings", () => {
    const resource = { ...tree[0].groups[0], kind: "resource" as const };
    renderSidebar([{ ...tree[0], groups: [resource], pages: [] }]);
    expect(screen.getByRole("link", { name: "Matrizes" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Conteúdo" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Recursos" })).not.toBeInTheDocument();
  });
});
