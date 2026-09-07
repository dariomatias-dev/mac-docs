import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TableOfContents } from "../toc";

const items = [
  { id: "primeira", text: "Primeira seção", depth: 2 as const },
  { id: "segunda", text: "Segunda seção", depth: 2 as const },
  { id: "terceira", text: "Terceira seção", depth: 3 as const },
];

let pending: FrameRequestCallback[] = [];

function flushFrames() {
  act(() => {
    const callbacks = pending;
    pending = [];
    for (const cb of callbacks) cb(0);
  });
}

// Mounts a real heading per item so document.getElementById(item.id) finds
// something, then stubs its position: the component reads
// getBoundingClientRect().top to decide which heading is "current".
function mountHeadingsAtTops(tops: Record<string, number>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  for (const item of items) {
    const el = document.createElement("h2");
    el.id = item.id;
    el.getBoundingClientRect = () => ({ top: tops[item.id] ?? 9999 }) as DOMRect;
    container.appendChild(el);
  }
  return container;
}

describe("TableOfContents", () => {
  beforeEach(() => {
    pending = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        pending.push(cb);
        return pending.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    // jsdom does no real layout: scrollHeight defaults to 0, which would
    // make every test hit the "scrolled to the bottom" branch by accident
    // (innerHeight + scrollY >= 0 - 2 is trivially true). Give it a large,
    // explicit value so only the dedicated "at the bottom" test is actually
    // at the bottom.
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(5000);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a link per heading, under the default label", () => {
    mountHeadingsAtTops({ primeira: 500 });
    render(<TableOfContents items={items} />);

    expect(screen.getByText("Neste artigo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Primeira seção" })).toHaveAttribute(
      "href",
      "#primeira",
    );
  });

  it("uses a custom label when given", () => {
    mountHeadingsAtTops({ primeira: 500 });
    render(<TableOfContents items={items} label="Nesta página" />);
    expect(screen.getByText("Nesta página")).toBeInTheDocument();
  });

  it("marks the last heading scrolled past (top <= 120) as active", () => {
    mountHeadingsAtTops({ primeira: -400, segunda: 50, terceira: 300 });
    render(<TableOfContents items={items} />);

    flushFrames();

    expect(screen.getByRole("link", { name: "Segunda seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Primeira seção" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("falls back to the first heading when none has been scrolled past yet", () => {
    mountHeadingsAtTops({ primeira: 400, segunda: 800, terceira: 1200 });
    render(<TableOfContents items={items} />);

    flushFrames();

    expect(screen.getByRole("link", { name: "Primeira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("marks the last heading active when scrolled to the bottom of the page", () => {
    mountHeadingsAtTops({ primeira: -900, segunda: -500, terceira: -100 });
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(1800);

    render(<TableOfContents items={items} />);
    flushFrames();

    expect(screen.getByRole("link", { name: "Terceira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });
});
