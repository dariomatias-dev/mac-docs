"use client";

import { useEffect } from "react";

import { RefreshCw } from "lucide-react";

type DocsErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function DocsError({ error, unstable_retry }: DocsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1600px] px-12 pt-24 pb-28">
      <div className="max-w-xl">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Não foi possível carregar esta página
        </h1>
        <p className="text-muted mt-2">
          Ocorreu um erro ao renderizar este conteúdo. Pode ser um problema temporário — tente
          novamente.
        </p>
        {error.digest && (
          <p className="text-muted mt-2 font-mono text-xs">Código: {error.digest}</p>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="bg-accent text-accent-foreground flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
