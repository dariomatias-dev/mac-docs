import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { HeadingAnchor } from "./heading-anchor";
import { rehypeHeadingId } from "../lib/rehype-heading-id";
import { rehypeKatexA11y } from "../lib/rehype-katex-a11y";

// Dual-theme Shiki output: each token carries both a --shiki-light and
// --shiki-dark CSS variable; globals.css swaps between them on `.dark`.
// keepBackground:false keeps the existing .prose pre surface/border styling.
const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "light-plus", dark: "dark-plus" },
  keepBackground: false,
};

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeHeadingId,
      rehypeSlug,
      rehypeKatex,
      rehypeKatexA11y,
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
};

// Scrollable code blocks must be keyboard-focusable to satisfy WCAG (axe
// scrollable-region-focusable). tabIndex 0 lets keyboard users scroll them.
// GFM task-list checkboxes render without a label, so give them one.
const baseComponents: MDXRemoteProps["components"] = {
  h2: (props) => <HeadingAnchor level={2} {...props} />,
  h3: (props) => <HeadingAnchor level={3} {...props} />,
  h4: (props) => <HeadingAnchor level={4} {...props} />,
  a: ({ children, ...props }) => (
    <a
      className="text-accent decoration-accent/35 underline-offset-[3px] transition-colors hover:decoration-current"
      {...props}
    >
      {children}
    </a>
  ),
  code: (props) => (
    <code
      className="bg-surface-2 text-accent rounded-chip px-1.5 py-0.5 text-[0.875em] font-medium"
      {...props}
    />
  ),
  pre: (props) => (
    // tabIndex is required here: axe's scrollable-region-focusable check
    // demands it so keyboard users can scroll a code block that overflows.
    // eslint.config.mjs allows tabIndex on <pre> in
    // jsx-a11y/no-noninteractive-tabindex's `tags` option for this reason.
    <pre
      tabIndex={0}
      role="region"
      aria-label="Bloco de código"
      className="bg-surface text-foreground border-border rounded-card border [&>code]:bg-transparent [&>code]:p-0 [&>code]:font-normal [&>code]:text-inherit"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-accent bg-surface text-muted-2 rounded-r-card border-l-[3px] px-5 py-3.5 font-normal not-italic [quotes:none] [&>p]:m-0 [&>p]:before:content-none [&>p]:after:content-none"
      {...props}
    />
  ),
  table: (props) => (
    <table
      className="border-border overflow-hidden rounded-card border border-separate border-spacing-0"
      {...props}
    />
  ),
  thead: (props) => <thead className="bg-surface" {...props} />,
  th: (props) => (
    <th
      className="text-foreground px-4 py-2.5 text-[0.8125rem] font-semibold"
      {...props}
    />
  ),
  td: (props) => <td className="px-4 py-2.5 align-top" {...props} />,
  input: (props) =>
    props.type === "checkbox" ? (
      <input {...props} aria-label={props.checked ? "Concluído" : "A fazer"} />
    ) : (
      <input {...props} />
    ),
};

export function MdxRenderer({
  source,
  components,
}: {
  source: string;
  components?: MDXRemoteProps["components"];
}) {
  return (
    <MDXRemote
      source={source}
      options={options}
      components={{ ...baseComponents, ...components }}
    />
  );
}
