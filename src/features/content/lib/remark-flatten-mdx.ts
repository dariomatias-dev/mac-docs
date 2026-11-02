import type { Root } from "mdast";

// Minimal local shapes for the MDX nodes remark-mdx produces; the full
// types live in mdast-util-mdx-jsx, which isn't a direct dependency.
type AnyNode = { type: string; value?: string; children?: AnyNode[]; [key: string]: unknown };
type JsxAttribute = { type: string; name?: string; value?: unknown };
type JsxElement = AnyNode & { name: string | null; attributes: JsxAttribute[] };

const text = (value: string): AnyNode => ({ type: "text", value });
const strong = (children: AnyNode[]): AnyNode => ({ type: "strong", children });
const paragraph = (children: AnyNode[]): AnyNode => ({ type: "paragraph", children });
const label = (value: string): AnyNode => paragraph([strong([text(value)])]);

function isJsx(node: AnyNode): node is JsxElement {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function attr(node: JsxElement, name: string): string | undefined {
  const found = node.attributes.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  return typeof found?.value === "string" ? found.value : undefined;
}

// Purely visual or interactive widgets: what they show has no faithful
// textual form, and their props are config rather than reading content.
const DROPPED = new Set([
  "BooleanMatrixCalculator",
  "BooleanMatrixExercise",
  "ClassSchedule",
  "MatrixCalculator",
  "MatrixExercise",
  "Quiz",
  "RegionDiagram",
  "ScatterGraph",
  "SetCalculator",
]);

/**
 * Rewrites the MDX-only nodes of a remark-mdx tree into plain mdast, so the
 * result can be stringified as ordinary Markdown or stripped to text. Each
 * course component maps to the Markdown that reads like what the page shows
 * (an `<Answer>` becomes a "Resposta" label followed by its content, a
 * `<Callout>` a blockquote, and so on). Unknown elements, including raw
 * `<div>`/`<span>` wrappers, are unwrapped so their children always survive.
 */
export function remarkFlattenMdx() {
  return (tree: Root) => {
    let exercise = 0;

    function convert(node: AnyNode, previous: AnyNode | undefined): AnyNode[] {
      if (
        node.type === "mdxjsEsm" ||
        node.type === "mdxFlowExpression" ||
        node.type === "mdxTextExpression"
      ) {
        return [];
      }
      if (!isJsx(node)) {
        if (node.children) node.children = convertAll(node.children);
        return [node];
      }

      const name = node.name ?? "";
      const flow = node.type === "mdxJsxFlowElement";
      if (DROPPED.has(name)) return [];
      // Handled before the generic child conversion below, which would
      // unwrap the <Alternative> elements this needs to tell apart.
      if (name === "Alternatives") {
        return [alternatives(collectOptions(node.children ?? []).map(convertOption))];
      }
      // Numbered in document order, matching the CSS counter that labels
      // untitled cards on the page; read before converting nested content.
      if (name === "Exercise") exercise += 1;
      const exerciseNumber = exercise;
      const children = convertAll(node.children ?? []);
      const title = attr(node, "title");

      switch (name) {
        case "Answer":
          return [label("Resposta"), ...children];
        case "Resolution":
          return [label("Resolução"), ...children];
        case "Exercise":
          return [label(title ?? `Exercício ${exerciseNumber}`), ...children];
        case "StepByStep":
          return [label(title ?? "Resolução passo a passo"), ...children];
        case "Step":
        case "Collapsible":
          return title ? [label(title), ...children] : children;
        case "Callout":
          return [{ type: "blockquote", children: title ? [label(title), ...children] : children }];
        case "Marker":
          return [strong(children)];
        case "Badge": {
          const gap = previous?.type === "text" && /\s$/.test(previous.value ?? "") ? "" : " ";
          return [text(`${gap}· `), ...children];
        }
        case "PixelGrid":
          return [pixelGrid(node, flow)];
        case "YouTube": {
          const link = youTubeLink(node);
          return link ? [flow ? paragraph([link]) : link] : [];
        }
        default:
          return children;
      }
    }

    // An option's blocks; a one-line <Alternative> is inline, so its
    // phrasing content gets the paragraph a list item needs.
    function convertOption(option: JsxElement): AnyNode[] {
      const content = convertAll(option.children ?? []);
      return option.type === "mdxJsxTextElement" ? [paragraph(content)] : content;
    }

    function convertAll(nodes: AnyNode[]): AnyNode[] {
      const out: AnyNode[] = [];
      for (const node of nodes) out.push(...convert(node, out.at(-1)));
      return out;
    }

    tree.children = convertAll(tree.children as AnyNode[]) as Root["children"];
  };
}

const LETTERS = "abcdefghij";

// A one-line <Alternative> parses as an inline element inside a paragraph,
// a multi-line one as a block of its own; both count as an option.
function collectOptions(nodes: AnyNode[]): JsxElement[] {
  return nodes.flatMap((node) => {
    if (isJsx(node)) return node.name === "Alternative" ? [node] : [];
    return node.type === "paragraph" ? collectOptions(node.children ?? []) : [];
  });
}

// <Alternatives> letters its options on the page; a Markdown ordered list
// can only number them, so the letter goes into each item's text instead.
function alternatives(options: AnyNode[][]): AnyNode {
  const items = options.map((blocks, i) => {
    const [first, ...rest] = blocks.length > 0 ? blocks : [paragraph([])];
    const prefix = text(`${LETTERS[i] ?? i + 1}) `);
    const head =
      first.type === "paragraph"
        ? { ...first, children: [prefix, ...(first.children ?? [])] }
        : paragraph([prefix, first]);
    return { type: "listItem", spread: false, children: [head, ...rest] };
  });
  return { type: "list", ordered: false, spread: false, children: items };
}

// The grid is a boolean image matrix (1 = white cell); its rows of digits
// are the lossless textual form, and the same notation the exercises use.
function pixelGrid(node: JsxElement, flow: boolean): AnyNode {
  const cells = (attr(node, "pattern") ?? "").replace(/\s+/g, "");
  const columns = Math.max(1, Number(attr(node, "columns")) || cells.length || 1);
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += columns) rows.push(cells.slice(i, i + columns));
  return flow
    ? { type: "code", lang: null, meta: null, value: rows.join("\n") }
    : { type: "inlineCode", value: rows.join(" ") };
}

function youTubeLink(node: JsxElement): AnyNode | undefined {
  const id = attr(node, "id")?.trim();
  if (!id) return undefined;
  const url = /^https?:\/\//.test(id) ? id : `https://www.youtube.com/watch?v=${id}`;
  return { type: "link", url, children: [text(attr(node, "title") ?? "Vídeo do YouTube")] };
}
