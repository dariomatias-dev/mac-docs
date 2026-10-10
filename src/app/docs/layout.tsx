import { DocsShell, getSidebarTree } from "@/features/navigation";
import { SearchButton, SearchDialog } from "@/features/search";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getSidebarTree();

  return (
    <DocsShell tree={tree} search={<SearchDialog />} searchMobile={<SearchButton />}>
      {children}
    </DocsShell>
  );
}
