import { Code2 } from "lucide-react";

export function CodeContributorsSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-accent-soft text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Code2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">Código</h2>
          <p className="text-muted text-sm leading-relaxed">
            Contribuidores do repositório no GitHub, por número de commits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-background flex items-center gap-3 rounded-[10px] border p-4"
          >
            <span className="bg-surface-2 h-12 w-12 shrink-0 animate-pulse rounded-full" />
            <span className="flex-1 space-y-2">
              <span className="bg-surface-2 block h-3.5 w-2/3 animate-pulse rounded" />
              <span className="bg-surface-2 block h-3 w-1/3 animate-pulse rounded" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
