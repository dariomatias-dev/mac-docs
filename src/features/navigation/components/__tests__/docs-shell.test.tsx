import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import { SidebarCollapseProvider } from "../../providers/sidebar-collapse-provider";
import { SidebarGroupsProvider } from "../../providers/sidebar-groups-provider";
import { DocsShell } from "../docs-shell";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/a" }));

function renderShell() {
  return render(
    <ActiveMobileSheetProvider>
      <SidebarCollapseProvider>
        <SidebarGroupsProvider>
          <DocsShell tree={[]}>
            <p>Conteúdo da página</p>
          </DocsShell>
        </SidebarGroupsProvider>
      </SidebarCollapseProvider>
    </ActiveMobileSheetProvider>,
  );
}

describe("DocsShell", () => {
  it("renders its children alongside the sidebar", () => {
    renderShell();
    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
  });
});
