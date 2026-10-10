import { Clock } from "lucide-react";
import Link from "next/link";


export type Prereq = { href: string; title: string };

export function PageMeta({ minutes, prerequisites }: { minutes: number; prerequisites: Prereq[] }) {
  return (
    <div className="text-muted flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {minutes} min de leitura
      </span>

      {prerequisites.length > 0 && (
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>Pré-requisitos:</span>
          {prerequisites.map((prereq) => (
            <Link
              key={prereq.href}
              href={prereq.href}
              className="bg-accent-soft text-accent hover:bg-accent hover:text-accent-foreground rounded-chip px-2 py-0.5 text-xs font-medium transition-colors"
            >
              {prereq.title}
            </Link>
          ))}
        </span>
      )}
    </div>
  );
}
