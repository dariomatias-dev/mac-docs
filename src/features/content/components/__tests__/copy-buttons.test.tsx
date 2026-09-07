import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyButtons } from "../copy-buttons";

describe("CopyButtons", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("only shows the page-content button when there is no section text", () => {
    render(<CopyButtons pageText="conteúdo da página" />);
    expect(screen.getByRole("button", { name: "Copiar conteúdo" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copiar seção" })).not.toBeInTheDocument();
  });

  it("shows both buttons when section text is given", () => {
    render(<CopyButtons pageText="página" sectionText="seção" />);
    expect(screen.getByRole("button", { name: "Copiar seção" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar conteúdo" })).toBeInTheDocument();
  });

  it("copies the page text and shows feedback that resets after a delay", async () => {
    render(<CopyButtons pageText="conteúdo da página" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar conteúdo" }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("conteúdo da página");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button", { name: "Copiar conteúdo" })).toBeInTheDocument();
  });

  it("copies the section text independently of the page text button", async () => {
    render(<CopyButtons pageText="página" sectionText="apenas a seção" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar seção" }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("apenas a seção");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar conteúdo" })).toBeInTheDocument();
  });
});
