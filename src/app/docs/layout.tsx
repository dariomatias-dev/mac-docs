import { DocsShell, getSidebarTree } from "@/features/navigation";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getSidebarTree();

  return <DocsShell tree={tree}>{children}</DocsShell>;
}
