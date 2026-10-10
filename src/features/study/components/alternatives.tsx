import { Children, isValidElement, type ReactNode } from "react";

const LETTERS = "abcdefghij";

export function Alternative(_props: { children: ReactNode }): null {
  return null;
}

export function Alternatives({ children }: { children: ReactNode }) {
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => el.props as { children: ReactNode });

  return (
    <ol className="not-prose my-5 space-y-2.5">
      {options.map((opt, i) => (
        <li key={i} className="flex items-baseline gap-3">
          <span className="border-border text-muted-2 rounded-chip inline-flex h-6 min-w-6 shrink-0 translate-y-px items-center justify-center self-start border text-xs font-semibold">
            {LETTERS[i]}
          </span>
          <span className="min-w-0">{opt.children}</span>
        </li>
      ))}
    </ol>
  );
}
