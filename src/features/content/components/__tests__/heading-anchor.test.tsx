import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeadingAnchor } from "../heading-anchor";

describe("HeadingAnchor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    vi.spyOn(history, "replaceState").mockImplementation(() => {});
    window.history.pushState({}, "", "/docs/matrizes/operacoes");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the requested heading level with its id", () => {
    render(
      <HeadingAnchor level={2} id="secao">
        Título da seção
      </HeadingAnchor>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: /título da seção/i });
    expect(heading).toHaveAttribute("id", "secao");
  });

  it("renders no copy-link button when there is no id", () => {
    render(<HeadingAnchor level={3}>Sem âncora</HeadingAnchor>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("copies the deep link and pushes the hash into the URL on click", async () => {
    render(
      <HeadingAnchor level={3} id="operacoes">
        Operações
      </HeadingAnchor>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar link da seção" }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/docs/matrizes/operacoes#operacoes`,
    );
    expect(history.replaceState).toHaveBeenCalledWith(null, "", "#operacoes");
    expect(screen.getByRole("button", { name: "Link copiado" })).toBeInTheDocument();
  });

  it("resets the copied feedback after the delay", async () => {
    render(
      <HeadingAnchor level={3} id="operacoes">
        Operações
      </HeadingAnchor>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar link da seção" }));
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByRole("button", { name: "Copiar link da seção" })).toBeInTheDocument();
  });
});
