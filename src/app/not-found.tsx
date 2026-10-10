import { ArrowLeft, Search } from "lucide-react";

import { CtaLink } from "@/shared/components/cta-link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="from-accent to-accent-bright bg-linear-to-br bg-clip-text text-7xl font-semibold tracking-tighter text-transparent tabular-nums">
        404
      </p>
      <h1 className="text-foreground mt-4 text-3xl font-semibold tracking-tight">
        Página não encontrada
      </h1>
      <p className="text-muted mt-2 max-w-md">
        O conteúdo buscado não existe ou foi movido. Use a busca (Ctrl K) ou volte ao início.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaLink href="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </CtaLink>
        <CtaLink href="/docs/matematica-discreta" variant="secondary">
          <Search className="h-4 w-4" />
          Explorar a documentação
        </CtaLink>
      </div>
    </main>
  );
}
