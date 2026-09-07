import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getNextClassMock } = vi.hoisted(() => ({ getNextClassMock: vi.fn() }));
vi.mock("@/features/schedule/lib/schedule", () => ({ getNextClass: getNextClassMock }));

import { NextClassCard } from "../next-class-card";

describe("NextClassCard", () => {
  it("shows the next class's date and topic", () => {
    getNextClassMock.mockReturnValue({ date: "2026-09-08", topic: "Avaliação 1" });

    render(<NextClassCard />);

    expect(screen.getByText("Avaliação 1")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("terça-feira"))).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/plano-de-disciplina",
    );
  });

  it("shows the end-of-semester message once there are no more classes", () => {
    getNextClassMock.mockReturnValue(null);

    render(<NextClassCard />);

    expect(screen.getByText(/semestre encerrado/i)).toBeInTheDocument();
  });

  it("renders nothing before the client value is known", () => {
    getNextClassMock.mockReturnValue(undefined);

    const { container } = render(<NextClassCard />);

    expect(container).toBeEmptyDOMElement();
  });
});
