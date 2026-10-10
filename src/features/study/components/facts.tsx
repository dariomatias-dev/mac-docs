import { Children, isValidElement, type ReactNode } from "react";

type WithChildren = { children?: ReactNode };
type Fact = { label: string; value: ReactNode[] };

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<WithChildren>(node)) return textOf(node.props.children);
  return "";
}

function collectItems(node: ReactNode, items: ReactNode[][]) {
  Children.forEach(node, (child) => {
    if (!isValidElement<WithChildren>(child)) return;
    if (child.type === "li") items.push(Children.toArray(child.props.children));
    else collectItems(child.props.children, items);
  });
}

/** Reads `- **Label:** value` items out of the Markdown list it wraps. */
export function parseFacts(list: ReactNode): Fact[] {
  const items: ReactNode[][] = [];
  collectItems(list, items);

  const facts: Fact[] = [];
  for (const [first, ...rest] of items) {
    if (!isValidElement(first) || first.type !== "strong") return [];
    const label = textOf(first).trim().replace(/:$/, "");
    const value = rest.map((node, i) =>
      i === 0 && typeof node === "string" ? node.trimStart() : node,
    );
    facts.push({ label, value });
  }
  return facts;
}

/**
 * MDX wrapper that turns a `- **Label:** value` list into a grid of labelled
 * cards. The list stays in the MDX source, so search and "copy page" keep
 * its text; anything that isn't in that shape renders as the plain list.
 */
export function Facts({ children }: { children: ReactNode }) {
  const facts = parseFacts(children);
  if (facts.length === 0) return <>{children}</>;

  return (
    <dl className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map(({ label, value }) => (
        <div key={label} className="border-border bg-background rounded-card border px-5 py-4">
          <dt className="text-muted text-xs font-medium">{label}</dt>
          <dd className="text-foreground mt-1.5 leading-snug font-medium [overflow-wrap:anywhere]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
