import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function DocsNotFound() {
  return (
    <div className="mx-auto max-w-[1600px] px-12 pt-24 pb-28">
      <div className="max-w-xl">
        <h1 className="text-foreground mt-2 text-4xl font-bold tracking-tight">
          Conteúdo não encontrado
        </h1>
        <p className="text-muted mt-2">
          Esta página da documentação não existe ou foi movida. Use a busca (Ctrl K) ou volte ao
          sumário.
        </p>

        <div className="mt-8">
          <Link
            href="/docs/calculo-1/limites/conceito-intuitivo"
            className="bg-accent text-accent-foreground inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir para o início da documentação
          </Link>
        </div>
      </div>
    </div>
  );
}
