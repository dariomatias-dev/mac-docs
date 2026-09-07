import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PrevNextNav } from "../prev-next-nav";

const page = (title: string, href: string) => ({ title, href, slug: [], order: 0 });

describe("PrevNextNav", () => {
  it("renders nothing when there's neither a previous nor a next page", () => {
    const { container } = render(<PrevNextNav prev={null} next={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only the previous link at the start of a course", () => {
    render(<PrevNextNav prev={page("Introdução", "/docs/a")} next={null} />);
    expect(screen.getByRole("link", { name: /introdução/i })).toHaveAttribute("href", "/docs/a");
    expect(screen.getByText("Anterior")).toBeInTheDocument();
    expect(screen.queryByText("Próximo")).not.toBeInTheDocument();
  });

  it("renders only the next link at the end of a course", () => {
    render(<PrevNextNav prev={null} next={page("Conclusão", "/docs/z")} />);
    expect(screen.getByRole("link", { name: /conclusão/i })).toHaveAttribute("href", "/docs/z");
    expect(screen.getByText("Próximo")).toBeInTheDocument();
    expect(screen.queryByText("Anterior")).not.toBeInTheDocument();
  });

  it("renders both links in the middle of a course", () => {
    render(<PrevNextNav prev={page("Conjuntos", "/docs/a")} next={page("Relações", "/docs/b")} />);
    expect(screen.getByRole("link", { name: /conjuntos/i })).toHaveAttribute("href", "/docs/a");
    expect(screen.getByRole("link", { name: /relações/i })).toHaveAttribute("href", "/docs/b");
  });
});
