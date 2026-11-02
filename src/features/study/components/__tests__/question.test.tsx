import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Question } from "../question";

describe("Question", () => {
  it("renders its children, with no title bar of its own", () => {
    render(
      <Question>
        <p>Sejam a e b números reais</p>
      </Question>,
    );
    expect(screen.getByText("Sejam a e b números reais")).toBeInTheDocument();
    // Number/source/points live in the heading above; Question must
    // not render its own "Questão N" label.
    expect(screen.queryByText(/questão/i)).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});

describe("Question copy button", () => {
  it("copies the injected Markdown", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Question copyMarkdown="# Questão 1">conteúdo</Question>);

    await userEvent.click(screen.getByRole("button", { name: "Copiar questão em Markdown" }));

    expect(writeText).toHaveBeenCalledWith("# Questão 1");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
  });

  it("shows no copy button without Markdown", () => {
    render(<Question>conteúdo</Question>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
