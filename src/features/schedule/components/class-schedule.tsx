import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import { ClassTimeline, type TimelineSession } from "./class-timeline";

type WithChildren = { children?: ReactNode };

const BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<WithChildren>(node)) return textOf(node.props.children);
  return "";
}

function hasStrong(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.some(hasStrong);
  if (!isValidElement<WithChildren>(node)) return false;
  return node.type === "strong" || hasStrong(node.props.children);
}

function collectRows(node: ReactNode, rows: ReactElement<WithChildren>[]) {
  Children.forEach(node, (child) => {
    if (!isValidElement<WithChildren>(child)) return;
    if (child.type === "tr") rows.push(child);
    else collectRows(child.props.children, rows);
  });
}

/** Reads `| dd/mm/yyyy | topic |` rows out of the Markdown table it wraps. */
export function parseSessions(table: ReactNode): TimelineSession[] {
  const rows: ReactElement<WithChildren>[] = [];
  collectRows(table, rows);

  return rows.flatMap((row) => {
    const cells = Children.toArray(row.props.children).filter(isValidElement<WithChildren>);
    if (cells.length < 2) return [];
    const match = BR_DATE.exec(textOf(cells[0]).trim());
    if (!match) return [];
    const [, day, month, year] = match;
    return [
      {
        date: `${year}-${month}-${day}`,
        topic: textOf(cells[1]).trim(),
        // Rows the author set in bold (the exams) get flagged in the timeline.
        emphasized: hasStrong(cells),
      },
    ];
  });
}

/**
 * MDX wrapper around the course's `Data | Assunto` table: renders it as a
 * timeline that highlights the next class. The table stays in the MDX
 * source, so search and "copy page" keep its text; if it can't be parsed,
 * the table renders as is.
 */
export function ClassSchedule({ children }: { children: ReactNode }) {
  const sessions = parseSessions(children);
  if (sessions.length === 0) return <>{children}</>;
  return <ClassTimeline sessions={sessions} />;
}
