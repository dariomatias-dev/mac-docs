import { ArrowRight, BookOpenCheck, Code2, Flag, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

import {
  MATERIAL_CONTRIBUTORS,
  MONITORS,
  CodeContributorsSection,
  CodeContributorsSkeleton,
  ContributorCard,
  ContributorSection,
  getGithubAvatarUrl,
  getTeam,
  githubHandle,
} from "@/features/contributors";
import { CtaLink } from "@/shared/components/cta-link";
import { REPO_URL } from "@/shared/lib/repo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribuidores",
  description: "Quem contribui com monitoria, material e código da disciplina de MAC.",
  alternates: { canonical: "/contribuidores" },
};

const WAYS_TO_CONTRIBUTE: {
  title: string;
  description: string;
  cta: string;
  href: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Reportar um erro",
    description:
      "Viu uma conta errada, uma demonstração incompleta ou uma fórmula quebrada? Descreva no formulário de erro de conteúdo.",
    cta: "Abrir o formulário",
    href: `${REPO_URL}/issues/new?template=content_issue.yml`,
    Icon: Flag,
  },
  {
    title: "Escrever ou revisar conteúdo",
    description:
      "Cada página é um arquivo .mdx. O guia de autoria mostra a estrutura, o frontmatter e os componentes de estudo.",
    cta: "Ler o guia de autoria",
    href: `${REPO_URL}/blob/main/docs/authoring.pt-BR.md`,
    Icon: BookOpenCheck,
  },
  {
    title: "Melhorar o código",
    description:
      "O site é aberto: abra um pull request seguindo o guia de contribuição e a verificação local do projeto.",
    cta: "Ver o guia de contribuição",
    href: `${REPO_URL}/blob/main/docs/contributing.pt-BR.md`,
    Icon: Code2,
  },
];

export default function ContribuidoresPage() {
  const team = getTeam();

  return (
    <main className="flex-1">
      <section className="border-border relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_90%_10%,var(--accent-soft),transparent_70%)]"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-14 pb-14 sm:pt-20 sm:pb-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="text-foreground text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Contribuidores
            </h1>
            <p className="text-muted mt-4 max-w-[58ch] text-lg leading-relaxed">
              O MACDocs é feito pela monitoria, por quem produz material para a disciplina e por
              quem contribui com o código. Tudo é aberto e qualquer estudante pode ajudar.
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-muted text-sm">Monitoria</dt>
                <dd className="text-foreground text-2xl font-semibold tabular-nums">
                  {MONITORS.length} {MONITORS.length === 1 ? "monitor" : "monitores"}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-sm">Material</dt>
                <dd className="text-foreground text-2xl font-semibold tabular-nums">
                  {MATERIAL_CONTRIBUTORS.length}{" "}
                  {MATERIAL_CONTRIBUTORS.length === 1 ? "autor" : "autores"}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-sm">Código</dt>
                <dd className="text-foreground text-2xl font-semibold">Aberto no GitHub</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="#como-contribuir">
                Como contribuir
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink href={REPO_URL} target="_blank" rel="noreferrer" variant="secondary">
                Repositório no GitHub
              </CtaLink>
            </div>
          </div>

          {/* The team's GitHub avatars, overlapping, as the page's visual. */}
          <ul
            aria-label="Equipe"
            className="hidden justify-center -space-x-5 lg:col-span-4 lg:flex"
          >
            {team
              .filter((member) => member.githubUrl)
              .map((member) => (
                <li key={member.githubUrl}>
                  <Image
                    src={getGithubAvatarUrl(member.githubUrl)!}
                    alt={member.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="ring-background shadow-lift h-24 w-24 rounded-full ring-4"
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>

      <ContributorSection
        icon={Users}
        title="Equipe da disciplina"
        description="Monitores, que tiram dúvidas e apoiam os estudantes, e quem produz slides, exercícios e outros materiais."
        emptyMessage="Ainda não há pessoas cadastradas na equipe."
        hasItems={team.length > 0}
      >
        {team.map((member) => (
          <ContributorCard
            key={member.githubUrl ?? member.name}
            name={member.name}
            subtitle={githubHandle(member.githubUrl) ?? "Equipe de MAC"}
            href={member.githubUrl}
            avatarUrl={getGithubAvatarUrl(member.githubUrl)}
            tags={member.roles}
          />
        ))}
      </ContributorSection>

      <div className="border-border border-t">
        <Suspense fallback={<CodeContributorsSkeleton />}>
          <CodeContributorsSection />
        </Suspense>
      </div>

      <section id="como-contribuir" className="border-border bg-surface scroll-mt-20 border-t">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <h2 className="text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.04em] sm:text-[2.5rem]">
            Como contribuir
          </h2>
          <p className="text-muted mt-3 max-w-[60ch] text-lg leading-relaxed">
            Não é preciso saber programar: corrigir um erro ou sugerir uma explicação melhor já
            ajuda a turma inteira.
          </p>

          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {WAYS_TO_CONTRIBUTE.map(({ title, description, cta, href, Icon }) => (
              <li
                key={title}
                className="group border-border bg-background hover:border-accent/40 hover:shadow-soft rounded-card relative flex flex-col border p-6 transition-[border-color,box-shadow]"
              >
                <span className="bg-accent-soft text-accent rounded-control flex h-10 w-10 items-center justify-center">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-foreground mt-5 text-lg font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{description}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-dark dark:text-accent after:rounded-card mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold after:absolute after:inset-0"
                >
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
