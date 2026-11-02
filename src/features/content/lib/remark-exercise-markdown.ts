import { visit } from "unist-util-visit";

import { mdastToMarkdown } from "./mdast-to-markdown";

import type { Root, RootContent } from "mdast";

// Minimal local shape for remark-mdx's JSX nodes (their full types live in
// mdast-util-mdx-jsx, which isn't a direct dependency).
type JsxAttribute = { type: string; name?: string; value?: unknown };
type JsxElement = {
  type: "mdxJsxFlowElement";
  name: string | null;
  attributes: JsxAttribute[];
  children: RootContent[];
};

export type ExerciseMarkdownOptions = {
  /** Page title, so a pasted exercise still says what topic it's from. */
  title?: string;
};

function isJsx(node: unknown): node is JsxElement {
  return (node as { type?: string }).type === "mdxJsxFlowElement";
}

function attr(node: JsxElement, name: string): string | undefined {
  const found = node.attributes.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  return typeof found?.value === "string" ? found.value : undefined;
}

function toMarkdown(children: RootContent[]): string {
  return mdastToMarkdown({ type: "root", children } as Root);
}

/**
 * Gives every `<Exercise>` and `<Question>` a `copyMarkdown` prop holding
 * that one item as standalone Markdown (title, statement, answers, math as
 * LaTeX, and the page title), so a student can paste just that
 * exercise into an AI chat to ask about it.
 */
export function remarkExerciseMarkdown(options: ExerciseMarkdownOptions = {}) {
  return (tree: Root) => {
    // Mirrors the CSS counter that numbers untitled exercise cards: every
    // <Exercise> on the page counts, titled or not.
    let exercise = 0;

    visit(tree, (node, index, parent) => {
      if (!isJsx(node) || (node.name !== "Exercise" && node.name !== "Question")) return;

      let label: string | undefined;
      if (node.name === "Exercise") {
        exercise += 1;
        label = attr(node, "title") ?? `Exercício ${exercise}`;
      } else {
        // A question's number, source and points live in the `## Questão N`
        // heading right before it, not inside the element.
        const previous = parent && index !== undefined ? parent.children[index - 1] : undefined;
        if (previous?.type === "heading") {
          label = toMarkdown([{ type: "paragraph", children: previous.children }]);
        }
      }

      const header = [label, options.title].filter(Boolean).join(" · ");
      const parts = [
        header && `# ${header}`,
        toMarkdown(node.children),
      ];
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "copyMarkdown",
        value: parts.filter(Boolean).join("\n\n"),
      });
    });
  };
}
