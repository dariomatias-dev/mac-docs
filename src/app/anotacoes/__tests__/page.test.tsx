import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AnotacoesPage, { metadata } from "../page";

describe("AnotacoesPage", () => {
  it("renders the annotations list page", async () => {
    render(<AnotacoesPage />);
    expect(screen.getByRole("heading", { name: "Anotações" })).toBeInTheDocument();

    // The page loads the search index asynchronously to match notes back to
    // their pages; wait for that to settle so it doesn't update state after
    // the test (and its implicit unmount) has already moved on.
    await screen.findByText(
      "Nenhuma anotação ainda. Abra qualquer página de conteúdo e use o botão de anotações no canto da tela.",
    );
  });

  it("is excluded from indexing since it's a personal, device-local view", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toEqual({ canonical: "/anotacoes" });
  });
});
