import { SquarePen } from "lucide-react";

import { getEditUrl } from "@/shared/lib/content-config";

export function EditPageLink({ filePath }: { filePath: string }) {
  return (
    <a
      href={getEditUrl(filePath)}
      target="_blank"
      rel="noreferrer"
      className="text-muted hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
    >
      <SquarePen className="h-3.5 w-3.5" />
      Editar esta página no GitHub
    </a>
  );
}
