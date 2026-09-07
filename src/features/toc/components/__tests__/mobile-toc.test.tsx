import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MobileToc } from "../mobile-toc";

const items = [
  { id: "secao-1", text: "Seção 1", depth: 2 as const },
  { id: "secao-2", text: "Seção 2", depth: 2 as const },
];

describe("MobileToc", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<MobileToc items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("starts collapsed", () => {
    render(<MobileToc items={items} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("expands to list every item as an anchor link on click", async () => {
    render(<MobileToc items={items} />);
    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Seção 1" })).toHaveAttribute("href", "#secao-1");
    expect(screen.getByRole("link", { name: "Seção 2" })).toHaveAttribute("href", "#secao-2");
  });

  it("closes after following a link", async () => {
    render(<MobileToc items={items} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("link", { name: "Seção 1" }));

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("uses a custom label when given", () => {
    render(<MobileToc items={items} label="Nesta seção" />);
    expect(screen.getByText("Nesta seção")).toBeInTheDocument();
  });
});
