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
    <ol className="not-prose my-4 space-y-2">
      {options.map((opt, i) => (
        <li key={i} className="flex items-baseline gap-2">
          <span className="text-muted font-semibold">{LETTERS[i]})</span>
          <span>{opt.children}</span>
        </li>
      ))}
    </ol>
  );
}
