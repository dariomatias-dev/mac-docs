import type { Metadata } from "next";
import { Suspense } from "react";

import { GraduationCap, PenLine } from "lucide-react";

import {
  MATERIAL_CONTRIBUTORS,
  MONITORS,
  CodeContributorsSection,
  CodeContributorsSkeleton,
  ContributorCard,
  ContributorSection,
} from "@/features/contributors";

export const metadata: Metadata = {
  title: "Contribuidores",
  description: "Quem contribui com monitoria, material e código da disciplina de MAC.",
  alternates: { canonical: "/contribuidores" },
};

export default function ContribuidoresPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-4">
        <h1 className="from-accent-dark via-accent mb-1 bg-linear-to-br to-[#58c4dc] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Contribuidores
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">
          Pessoas que ajudam a construir este material: monitoria, autoria de conteúdo e código.
        </p>
      </section>

      <ContributorSection
        icon={GraduationCap}
        title="Monitoria"
        description="Monitores da disciplina, responsáveis por tirar dúvidas e apoiar os estudantes."
        emptyMessage="Ainda não há monitores cadastrados."
        hasItems={MONITORS.length > 0}
      >
        {MONITORS.map((contributor, index) => (
          <ContributorCard
            key={`${contributor.name}-${index}`}
            name={contributor.name}
            subtitle={contributor.role}
            href={contributor.githubUrl}
            avatarUrl={contributor.avatarUrl}
          />
        ))}
      </ContributorSection>

      <ContributorSection
        icon={PenLine}
        title="Material"
        description="Slides, exercícios e outros materiais produzidos para a disciplina."
        emptyMessage="Ainda não há contribuidores de material cadastrados."
        hasItems={MATERIAL_CONTRIBUTORS.length > 0}
      >
        {MATERIAL_CONTRIBUTORS.map((contributor, index) => (
          <ContributorCard
            key={`${contributor.name}-${index}`}
            name={contributor.name}
            subtitle={contributor.role}
            href={contributor.githubUrl}
            avatarUrl={contributor.avatarUrl}
          />
        ))}
      </ContributorSection>

      <Suspense fallback={<CodeContributorsSkeleton />}>
        <CodeContributorsSection />
      </Suspense>
    </main>
  );
}
