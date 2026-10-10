import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));

import { SiteChrome } from "../site-chrome";

describe("SiteChrome", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  it("renders its children outside the docs", () => {
    usePathnameMock.mockReturnValue("/contribuidores");
    render(
      <SiteChrome>
        <p>Cabeçalho</p>
      </SiteChrome>,
    );
    expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
  });

  it("renders nothing under /docs, which has its own chrome", () => {
    usePathnameMock.mockReturnValue("/docs/matematica-discreta/matrizes");
    const { container } = render(
      <SiteChrome>
        <p>Cabeçalho</p>
      </SiteChrome>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
