import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type * as ScheduleModule from "@/features/schedule/lib/schedule";

const { getNextClassMock } = vi.hoisted(() => ({ getNextClassMock: vi.fn() }));
vi.mock("@/features/schedule/lib/schedule", async (importOriginal) => ({
  ...(await importOriginal<typeof ScheduleModule>()),
  getNextClass: getNextClassMock,
}));

import { NextClassCard } from "../next-class-card";

describe("NextClassCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the next class's date and topic", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T08:00:00"));
    getNextClassMock.mockReturnValue({ date: "2026-09-08", topic: "Avaliação 1" });

    render(<NextClassCard />);

    expect(screen.getByText("Avaliação 1")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("terça-feira"))).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/plano-de-disciplina",
    );
  });

  it("shows 'Hoje' instead of the date once the class day arrives", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-08T08:00:00"));
    getNextClassMock.mockReturnValue({ date: "2026-09-08", topic: "Avaliação 1" });

    render(<NextClassCard />);

    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.getByText("Avaliação 1")).toBeInTheDocument();
    expect(screen.queryByText((text) => text.includes("terça-feira"))).not.toBeInTheDocument();
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
