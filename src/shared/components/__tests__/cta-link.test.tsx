import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CtaButton, CtaLink } from "../cta-link";

describe("CtaLink", () => {
  it("renders a link to the given href", () => {
    render(<CtaLink href="/docs/a">Começar</CtaLink>);
    expect(screen.getByRole("link", { name: "Começar" })).toHaveAttribute("href", "/docs/a");
  });

  it("defaults to the primary variant's classes", () => {
    render(<CtaLink href="/docs/a">Começar</CtaLink>);
    expect(screen.getByRole("link")).toHaveClass("bg-accent");
  });

  it("switches classes for the secondary variant", () => {
    render(
      <CtaLink href="/docs/a" variant="secondary">
        Ver mais
      </CtaLink>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-surface-2");
    expect(link).not.toHaveClass("bg-accent");
  });
});

describe("CtaButton", () => {
  it("renders a real button, not a link", () => {
    render(<CtaButton>Enviar</CtaButton>);
    const button = screen.getByRole("button", { name: "Enviar" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("passes through button props like onClick", async () => {
    render(<CtaButton disabled>Enviar</CtaButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
