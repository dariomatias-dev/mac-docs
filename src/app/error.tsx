"use client";

import { useEffect } from "react";

import { RefreshCw } from "lucide-react";

import { CtaButton } from "@/shared/components/cta-link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="from-accent-dark via-accent bg-linear-to-br to-[#58c4dc] bg-clip-text text-7xl font-bold tracking-tight text-transparent">
        Ops
      </p>
      <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight">Algo deu errado</h1>
      <p className="text-muted mt-2 max-w-md">
        Ocorreu um erro inesperado ao carregar este conteúdo. Tente novamente ou volte mais tarde.
      </p>
      {error.digest && <p className="text-muted mt-2 font-mono text-xs">Código: {error.digest}</p>}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaButton onClick={() => unstable_retry()}>
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </CtaButton>
      </div>
    </main>
  );
}
