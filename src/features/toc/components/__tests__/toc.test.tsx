import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    vi.useRealTimers();
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

  it("does nothing when none of the headings exist in the DOM yet", () => {
    render(<TableOfContents items={items} />);

    flushFrames();

    for (const item of items) {
      expect(screen.getByRole("link", { name: new RegExp(item.text) })).not.toHaveAttribute(
        "aria-current",
      );
    }
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

  it("marks the last heading active at the document bottom even if it is still below the reading line", () => {
    mountHeadingsAtTops({ primeira: -200, segunda: 200, terceira: 400 });
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

  it("scrolls the active link into view when it sits outside the visible nav", () => {
    mountHeadingsAtTops({ primeira: -900, segunda: -500, terceira: -100 });
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(1800);

    render(<TableOfContents items={items} />);

    const nav = screen.getByRole("navigation", { name: "Índice do artigo" });
    const last = screen.getByRole("link", { name: "Terceira seção" });
    nav.getBoundingClientRect = () => ({ top: 0, bottom: 200, height: 200 }) as DOMRect;
    Object.defineProperty(nav, "clientHeight", { value: 200, configurable: true });
    last.getBoundingClientRect = () => ({ top: 400, bottom: 440, height: 40 }) as DOMRect;

    flushFrames();

    expect(nav.scrollTop).not.toBe(0);
  });

  it("keeps the clicked heading active while the page is still scrolling to it", async () => {
    mountHeadingsAtTops({ primeira: 400, segunda: 800, terceira: 1200 });
    render(<TableOfContents items={items} />);
    flushFrames();

    const nav = screen.getByRole("navigation", { name: "Índice do artigo" });
    nav.getBoundingClientRect = () => ({ top: 0, bottom: 200, height: 200 }) as DOMRect;
    Object.defineProperty(nav, "clientHeight", { value: 200, configurable: true });
    screen.getByRole("link", { name: "Primeira seção" }).getBoundingClientRect = () =>
      ({ top: 40, bottom: 80, height: 40 }) as DOMRect;

    await userEvent.click(screen.getByRole("link", { name: "Terceira seção" }));
    const scrollAfterClick = nav.scrollTop;

    for (const [id, top] of Object.entries({ primeira: 50, segunda: 400, terceira: 900 })) {
      const el = document.getElementById(id);
      if (el) el.getBoundingClientRect = () => ({ top }) as DOMRect;
    }
    flushFrames();

    expect(screen.getByRole("link", { name: "Terceira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Primeira seção" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(nav.scrollTop).toBe(scrollAfterClick);
  });

  it("does not snap back to an earlier heading after a toc click settles", async () => {
    mountHeadingsAtTops({ primeira: 400, segunda: 800, terceira: 1200 });
    render(<TableOfContents items={items} />);
    flushFrames();

    await userEvent.click(screen.getByRole("link", { name: "Terceira seção" }));

    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    for (const [id, top] of Object.entries({ primeira: -40, segunda: 80, terceira: 260 })) {
      const el = document.getElementById(id);
      if (el) el.getBoundingClientRect = () => ({ top }) as DOMRect;
    }
    flushFrames();
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(screen.getByRole("link", { name: "Terceira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("scrolls upward to reveal an active entry above the nav viewport", () => {
    mountHeadingsAtTops({ primeira: -400, segunda: 50, terceira: 300 });
    render(<TableOfContents items={items} />);
    const nav = screen.getByRole("navigation", { name: "Índice do artigo" });
    nav.scrollTop = 100;
    nav.getBoundingClientRect = () => ({ top: 50, bottom: 250 }) as DOMRect;
    screen.getByRole("link", { name: "Segunda seção" }).getBoundingClientRect = () =>
      ({ top: 20, bottom: 40, height: 20 }) as DOMRect;

    flushFrames();

    expect(nav.scrollTop).toBe(70);
  });

  it("resumes the scroll spy after a clicked heading settles", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    mountHeadingsAtTops({ primeira: 50, segunda: 400, terceira: 900 });
    render(<TableOfContents items={items} />);
    flushFrames();
    const target = screen.getByRole("link", { name: "Terceira seção" });
    fireEvent.click(target);
    fireEvent.scroll(window);
    flushFrames();
    await act(() => vi.advanceTimersByTimeAsync(150));
    expect(target).toHaveAttribute("aria-current", "location");

    fireEvent.scroll(window);
    flushFrames();
    expect(screen.getByRole("link", { name: "Primeira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(target).not.toHaveAttribute("aria-current");
  });

  it("marks the first entry immediately when returning to the top", () => {
    mountHeadingsAtTops({ primeira: -400, segunda: 50, terceira: 300 });
    render(<TableOfContents items={items} />);
    flushFrames();
    fireEvent.click(screen.getByRole("link", { name: "Voltar ao topo" }));
    expect(screen.getByRole("link", { name: "Primeira seção" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Segunda seção" })).not.toHaveAttribute("aria-current");
  });
});
