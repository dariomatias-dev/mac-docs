import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { HeadingAnchor } from "./heading-anchor";

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
    rehypePlugins: [rehypeSlug, rehypeKatex, [rehypePrettyCode, prettyCodeOptions]],
  },
};

// Scrollable code blocks must be keyboard-focusable to satisfy WCAG (axe
// scrollable-region-focusable). tabIndex 0 lets keyboard users scroll them.
// GFM task-list checkboxes render without a label, so give them one.
const baseComponents: MDXRemoteProps["components"] = {
  h2: (props) => <HeadingAnchor level={2} {...props} />,
  h3: (props) => <HeadingAnchor level={3} {...props} />,
  h4: (props) => <HeadingAnchor level={4} {...props} />,
  pre: (props) => <pre tabIndex={0} {...props} />,
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
