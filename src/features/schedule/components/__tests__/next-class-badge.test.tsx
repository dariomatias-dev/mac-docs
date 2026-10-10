import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type * as ScheduleModule from "@/features/schedule/lib/schedule";

const { getNextClassIndexMock } = vi.hoisted(() => ({ getNextClassIndexMock: vi.fn() }));
vi.mock("@/features/schedule/lib/schedule", async (importOriginal) => ({
  ...(await importOriginal<typeof ScheduleModule>()),
  CLASS_SCHEDULE: [
    { date: "2026-09-01", topic: "Conjuntos e sua cardinalidade" },
    { date: "2026-09-08", topic: "Avaliação 1" },
  ],
  getNextClassIndex: getNextClassIndexMock,
}));

import { NextClassBadge } from "../next-class-badge";

describe("NextClassBadge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the next class's date and topic, linking to the course plan", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-02T08:00:00"));
    getNextClassIndexMock.mockReturnValue(1);

    render(<NextClassBadge />);

    expect(screen.getByText("Avaliação 1")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("terça-feira"))).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/plano-de-disciplina",
    );
  });

  it("says the class is today once the day arrives", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-08T08:00:00"));
    getNextClassIndexMock.mockReturnValue(1);

    render(<NextClassBadge />);

    expect(screen.getByText("Aula hoje")).toBeInTheDocument();
  });

  it("shows the end-of-semester message once there are no more classes", () => {
    getNextClassIndexMock.mockReturnValue(-1);

    render(<NextClassBadge />);

    expect(screen.getByText(/semestre encerrado/i)).toBeInTheDocument();
  });

  it("keeps the link named while the client value is unknown", () => {
    getNextClassIndexMock.mockReturnValue(undefined);

    render(<NextClassBadge />);

    expect(screen.getByRole("link", { name: /próxima aula/i })).toBeInTheDocument();
  });
});
