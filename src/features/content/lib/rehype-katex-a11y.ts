import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

// rehype-katex's .katex-display markup isn't a component we render — it's
// raw HTML from KaTeX — so tabIndex can't be set via JSX props like <pre>'s.
// Wide formulas scroll horizontally (see .katex-display in globals.css);
// WCAG requires scrollable regions to be reachable by keyboard
// (scrollable-region-focusable). Must run after rehype-katex, and must set
// this server-side — a client effect runs after axe/first paint and misses
// the a11y scan.
export function rehypeKatexA11y() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const className = node.properties?.className;
      const classes = Array.isArray(className) ? className : [className];
      if (!classes.includes("katex-display")) return;

      node.properties = node.properties ?? {};
      node.properties.tabIndex = 0;
    });
  };
}
