import { Code2 } from "lucide-react";

export function CodeContributorsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
      <div className="flex items-start gap-4">
        <span className="bg-accent-soft text-accent rounded-control flex h-10 w-10 shrink-0 items-center justify-center">
          <Code2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-[-0.03em] sm:text-[1.75rem]">
            Código
          </h2>
          <p className="text-muted mt-1 max-w-[60ch] leading-relaxed">
            Contribuidores do repositório no GitHub, por número de commits.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-background rounded-card flex items-center gap-4 border p-4"
          >
            <span className="bg-surface-2 h-13 w-13 shrink-0 animate-pulse rounded-full" />
            <span className="flex-1 space-y-2">
              <span className="bg-surface-2 rounded-chip block h-3.5 w-2/3 animate-pulse" />
              <span className="bg-surface-2 rounded-chip block h-3 w-1/3 animate-pulse" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
