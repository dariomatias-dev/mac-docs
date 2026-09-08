import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MathCopy } from "../math-copy";

function appendKatexDisplay(latex: string, parent: HTMLElement = document.body) {
  const display = document.createElement("div");
  display.className = "katex-display";
  display.innerHTML = `<annotation encoding="application/x-tex">${latex}</annotation>`;
  parent.appendChild(display);
  return display;
}

describe("MathCopy", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("adds a copy button to a formula outside .no-math-copy", async () => {
    appendKatexDisplay("A = 1");
    render(<MathCopy />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copiar latex/i })).toBeInTheDocument(),
    );
  });

  it("skips formulas inside .no-math-copy", async () => {
    const wrapper = document.createElement("div");
    wrapper.className = "no-math-copy";
    document.body.appendChild(wrapper);
    appendKatexDisplay("A = 1", wrapper);

    // A visible formula elsewhere confirms the effect actually ran;
    // otherwise an absent button could just mean the assertion ran too soon.
    appendKatexDisplay("B = 2");
    render(<MathCopy />);

    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /copiar latex/i })).toHaveLength(1),
    );
  });

  it("copies the raw LaTeX to the clipboard when the copy button is clicked", async () => {
    appendKatexDisplay("A = 1");
    render(<MathCopy />);

    const button = await screen.findByRole("button", { name: /copiar latex/i });
    await userEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("A = 1");
    expect(await screen.findByRole("button", { name: /copiado/i })).toBeInTheDocument();
  });

  it("skips a katex-display with no TeX annotation", async () => {
    const display = document.createElement("div");
    display.className = "katex-display";
    document.body.appendChild(display);
    render(<MathCopy />);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole("button", { name: /copiar latex/i })).toBeNull();
  });
});
