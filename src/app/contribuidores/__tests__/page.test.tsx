import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type * as ContributorsModule from "@/features/contributors";

vi.mock("@/features/contributors", async (importOriginal) => ({
  ...(await importOriginal<typeof ContributorsModule>()),
  CodeContributorsSection: () => <div>code contributors stub</div>,
}));

import ContribuidoresPage, { metadata } from "../page";

describe("ContribuidoresPage", () => {
  it("renders a card for every monitor and material contributor", async () => {
    const { MONITORS, MATERIAL_CONTRIBUTORS } = await import("@/features/contributors");
    render(<ContribuidoresPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Contribuidores" })).toBeInTheDocument();
    for (const monitor of MONITORS) {
      expect(screen.getAllByText(monitor.name).length).toBeGreaterThan(0);
    }
    for (const contributor of MATERIAL_CONTRIBUTORS) {
      expect(screen.getAllByText(contributor.name).length).toBeGreaterThan(0);
    }
  });

  it("has canonical metadata for the page", () => {
    expect(metadata.alternates).toEqual({ canonical: "/contribuidores" });
  });
});
