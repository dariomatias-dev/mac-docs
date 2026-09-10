import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AnotacoesPage, { metadata } from "../page";

describe("AnotacoesPage", () => {
  it("renders the annotations list page", () => {
    render(<AnotacoesPage />);
    expect(screen.getByRole("heading", { name: "Anotações" })).toBeInTheDocument();
  });

  it("is excluded from indexing since it's a personal, device-local view", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toEqual({ canonical: "/anotacoes" });
  });
});
