import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClassSchedule, parseSessions } from "../class-schedule";

const table = (
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Assunto</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>04/08/2026</td>
        <td>Matrizes</td>
      </tr>
      <tr>
        <td>
          <strong>08/09/2026</strong>
        </td>
        <td>
          <strong>Avaliação 1</strong>
        </td>
      </tr>
    </tbody>
  </table>
);

describe("parseSessions", () => {
  it("reads each dated row, flagging the bold ones", () => {
    expect(parseSessions(table)).toEqual([
      { date: "2026-08-04", topic: "Matrizes", emphasized: false },
      { date: "2026-09-08", topic: "Avaliação 1", emphasized: true },
    ]);
  });

  it("ignores rows whose first cell isn't a dd/mm/yyyy date", () => {
    const loose = (
      <table>
        <tbody>
          <tr>
            <td>Em breve</td>
            <td>Revisão</td>
          </tr>
        </tbody>
      </table>
    );
    expect(parseSessions(loose)).toEqual([]);
  });
});

describe("ClassSchedule", () => {
  it("renders the wrapped table untouched when it has no dated rows", () => {
    render(
      <ClassSchedule>
        <p>Sem cronograma</p>
      </ClassSchedule>,
    );
    expect(screen.getByText("Sem cronograma")).toBeInTheDocument();
  });

  it("renders a timeline entry per session", () => {
    render(<ClassSchedule>{table}</ClassSchedule>);
    expect(screen.getByText("Matrizes")).toBeInTheDocument();
    expect(screen.getAllByText("Avaliação 1").length).toBeGreaterThan(0);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
