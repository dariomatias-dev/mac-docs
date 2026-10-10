import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type * as ScheduleModule from "@/features/schedule/lib/schedule";

const { getNextClassIndexMock } = vi.hoisted(() => ({ getNextClassIndexMock: vi.fn() }));
vi.mock("@/features/schedule/lib/schedule", async (importOriginal) => ({
  ...(await importOriginal<typeof ScheduleModule>()),
  CLASS_SCHEDULE: [
    { date: "2026-09-01", topic: "Conjuntos e sua cardinalidade" },
    { date: "2026-09-08", topic: "Avaliação 1" },
    { date: "2026-09-15", topic: "Relações" },
    { date: "2026-09-22", topic: "Funções" },
  ],
  getNextClassIndex: getNextClassIndexMock,
}));

import { UpcomingClasses } from "../upcoming-classes";

describe("UpcomingClasses", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the next class's date and topic, then the ones after it", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-02T08:00:00"));
    getNextClassIndexMock.mockReturnValue(1);

    render(<UpcomingClasses />);

    expect(screen.getByText("Avaliação 1")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("terça-feira"))).toBeInTheDocument();
    expect(screen.getByText("Relações")).toBeInTheDocument();
    expect(screen.getByText("Funções")).toBeInTheDocument();
    expect(screen.queryByText("Conjuntos e sua cardinalidade")).not.toBeInTheDocument();
  });

  it("shows 'Hoje' instead of the date once the class day arrives", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-08T08:00:00"));
    getNextClassIndexMock.mockReturnValue(1);

    render(<UpcomingClasses />);

    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.queryByText((text) => text.includes("terça-feira"))).not.toBeInTheDocument();
  });

  it("shows the end-of-semester message once there are no more classes", () => {
    getNextClassIndexMock.mockReturnValue(-1);

    render(<UpcomingClasses />);

    expect(screen.getByText(/semestre encerrado/i)).toBeInTheDocument();
  });

  it("keeps the panel and its link while the client value is unknown", () => {
    getNextClassIndexMock.mockReturnValue(undefined);

    render(<UpcomingClasses />);

    expect(screen.getByText("Próxima aula")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cronograma completo/i })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/plano-de-disciplina",
    );
  });
});
