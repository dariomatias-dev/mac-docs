import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeKatex],
  },
};

export function MdxRenderer({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} options={options} />
    </div>
  );
}
