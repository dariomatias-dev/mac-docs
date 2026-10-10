import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ClassTimeline } from "../class-timeline";

const sessions = [
  { date: "2026-09-01", topic: "Conjuntos", emphasized: false },
  { date: "2026-09-08", topic: "Avaliação 1", emphasized: true },
  { date: "2026-09-15", topic: "Relações", emphasized: false },
];

describe("ClassTimeline", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("highlights the next class and counts the ones already given", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-02T08:00:00"));

    const { container } = render(<ClassTimeline sessions={sessions} />);

    const current = container.querySelector('[aria-current="step"]');
    expect(current).toHaveTextContent("Avaliação 1");
    expect(current).toHaveTextContent("Próxima aula");
    expect(screen.getByText("1 de 3")).toBeInTheDocument();
  });

  it("groups sessions under their month", () => {
    render(<ClassTimeline sessions={sessions} />);
    expect(screen.getByRole("region", { name: "Setembro" })).toBeInTheDocument();
  });

  it("marks the semester as over once every class has passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-01T08:00:00"));

    const { container } = render(<ClassTimeline sessions={sessions} />);

    expect(screen.getByText("Semestre encerrado")).toBeInTheDocument();
    expect(screen.getByText("3 de 3")).toBeInTheDocument();
    expect(container.querySelector('[aria-current="step"]')).toBeNull();
  });
});
