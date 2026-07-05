import { Sidebar, getSidebarTree } from "@/features/navigation";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getSidebarTree();

  return (
    <div className="flex w-full flex-1">
      <Sidebar tree={tree} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
