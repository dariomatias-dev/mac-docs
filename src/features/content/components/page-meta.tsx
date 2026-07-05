import Link from "next/link";

import { Clock } from "lucide-react";

export type Prereq = { href: string; title: string };

export function PageMeta({ minutes, prerequisites }: { minutes: number; prerequisites: Prereq[] }) {
  return (
    <div className="text-muted mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
              className="border-border text-accent hover:border-accent hover:bg-surface rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors"
            >
              {prereq.title}
            </Link>
          ))}
        </span>
      )}
    </div>
  );
}
