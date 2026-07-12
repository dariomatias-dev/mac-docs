import { ArrowLeft } from "lucide-react";

import { CtaLink } from "@/shared/components/cta-link";

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
          <CtaLink href="/docs/matematica-discreta">
            <ArrowLeft className="h-4 w-4" />
            Ir para o início da documentação
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
