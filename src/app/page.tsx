import katex from "katex";
import {
  ArrowRight,
  Calculator,
  Dices,
  CalendarRange,
  ClipboardCheck,
  ClipboardCopy,
  NotebookPen,
  Search,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  ContributorCard,
  MONITORS,
  getGithubAvatarUrl,
  githubHandle,
} from "@/features/contributors";
import { getSidebarTree, type SidebarGroup } from "@/features/navigation";
import { NextClassBadge, UpcomingClasses } from "@/features/schedule";
import { Callout, Option, Quiz } from "@/features/study";
import { CtaLink } from "@/shared/components/cta-link";
import { REPO_URL } from "@/shared/lib/repo";

import { getInteractiveTools, getMaterialStats } from "./home-data";

/** How a content fix reaches the site, for the home's contribution card. */
const FIX_STEPS = [
  {
    title: "Encontre o arquivo",
    description: "O endereço da página no site é o mesmo caminho dentro da pasta content/.",
  },
  {
    title: "Edite e abra um pull request",
    description: "Pelo próprio GitHub, sem instalar nada. Descreva o que mudou e por quê.",
  },
  {
    title: "Revisão e publicação",
    description: "A equipe revisa a mudança e, depois de aprovada, a correção entra no site.",
  },
];

// Rendered on the server so the home page ships no KaTeX JavaScript.
function tex(expr: string) {
  return { __html: katex.renderToString(expr, { displayMode: true, throwOnError: false }) };
}

/** One signature formula per study module, keyed by the module's folder name. */
const MODULE_FORMULAS: Record<string, string> = {
  matrizes: String.raw`\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}`,
  conjuntos: String.raw`A \cap B`,
  relacoes: String.raw`R \subseteq A \times B`,
  funcoes: String.raw`f\colon A \to B`,
  "tecnicas-de-demonstracao": String.raw`p \Rightarrow q`,
};

const SURJECTIVE = tex(String.raw`\forall y \in B,\ \exists x \in A \mid y = f(x)`);

const PAGE_TOOLS: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Busca em todo o material",
    description: "Ctrl K abre a busca de qualquer página.",
    Icon: Search,
  },
  {
    title: "Anotações por página",
    description: "Dúvidas e lembretes ficam salvos no seu navegador.",
    Icon: NotebookPen,
  },
  {
    title: "Copiar para IA",
    description: "Leve o texto de uma página ou seção para um assistente.",
    Icon: ClipboardCopy,
  },
];

const SECTION_TITLE =
  "text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.04em] sm:text-[2.75rem]";

const folderOf = (group: SidebarGroup) => group.slug[group.slug.length - 1];

function countLabel(group: SidebarGroup) {
  const count = group.pages.length + group.groups.length;
  // Groups like Avaliações hold semesters (subgroups), not topic pages.
  const [one, many] = group.pages.length > 0 ? ["tópico", "tópicos"] : ["semestre", "semestres"];
  return count > 0 ? `${count} ${count === 1 ? one : many}` : null;
}

function ResourceTile({ group, Icon }: { group: SidebarGroup; Icon: LucideIcon }) {
  const meta = countLabel(group);
  return (
    <div className="group border-border bg-background hover:border-accent/40 hover:shadow-lift rounded-card relative flex flex-col border p-7 transition-[border-color,box-shadow]">
      <span className="bg-accent-soft text-accent rounded-control flex h-10 w-10 items-center justify-center">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
        <Link
          href={group.href}
          className="text-foreground group-hover:text-accent after:rounded-card transition-colors after:absolute after:inset-0"
        >
          {group.title}
        </Link>
      </h3>
      {group.description && (
        <p className="text-muted mt-1.5 text-sm leading-relaxed">{group.description}</p>
      )}
      <div className="text-muted mt-auto flex items-center justify-between pt-6 text-sm">
        <span>{meta}</span>
        <ArrowRight
          aria-hidden="true"
          className="group-hover:text-accent h-4 w-4 transition-[color,translate] group-hover:translate-x-0.5"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const groups = getSidebarTree().flatMap((course) => course.groups);
  const modules = groups.filter((group) => folderOf(group) in MODULE_FORMULAS);
  const plan = groups.find((group) => folderOf(group) === "plano-de-disciplina");
  const assessments = groups.find((group) => folderOf(group) === "avaliacoes");
  const stats = getMaterialStats();
  const tools = getInteractiveTools();

  return (
    <main className="flex-1">
      <section className="border-border relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_90%_15%,var(--accent-soft),transparent_70%)]"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-24">
          <div className="lg:col-span-6">
            <p className="text-accent text-sm font-semibold">
              Matemática Aplicada à Computação, IFPB
            </p>
            <h1 className="text-foreground mt-5 text-[2.5rem] leading-[1.04] font-semibold tracking-tighter sm:text-[3.25rem] lg:text-[clamp(3rem,4vw,3.5rem)]">
              Matemática discreta, do conceito à <span className="text-accent">prova</span>.
            </h1>
            <p className="text-muted mt-6 max-w-[40ch] text-lg leading-relaxed sm:text-xl">
              Teoria, exemplos resolvidos e exercícios interativos da disciplina, na ordem das
              aulas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="/docs/matematica-discreta/matrizes">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink href="/docs/matematica-discreta" variant="secondary">
                Ver todos os tópicos
              </CtaLink>
            </div>
            <div className="mt-8">
              <NextClassBadge />
            </div>
          </div>

          <ul
            aria-label="Módulos"
            className="animate-rise grid grid-cols-2 gap-3 [animation-delay:100ms] sm:grid-cols-3 lg:col-span-6"
          >
            {modules.map((mod, i) => (
              <li
                key={mod.href}
                className={`group border-border hover:border-accent/50 hover:shadow-lift rounded-card relative flex min-h-36 flex-col border p-5 transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 ${
                  i === 0
                    ? "from-accent-soft to-background col-span-2 bg-linear-to-br sm:row-span-1"
                    : i === modules.length - 1
                      ? "bg-surface-2"
                      : "bg-background"
                }`}
              >
                {/* The title link stretches over the whole tile. */}
                <Link
                  href={mod.href}
                  className="text-foreground group-hover:text-accent after:rounded-card text-sm font-semibold transition-colors after:absolute after:inset-0"
                >
                  {mod.title}
                </Link>
                <span className="text-muted mt-0.5 text-xs">{countLabel(mod)}</span>
                <div
                  aria-hidden="true"
                  className={`katex-left text-foreground mt-auto overflow-hidden pt-4 [&_.katex-display]:m-0 ${
                    i === 0 ? "text-[1.75rem] sm:text-[2rem]" : "text-xl sm:text-2xl"
                  }`}
                  dangerouslySetInnerHTML={tex(MODULE_FORMULAS[folderOf(mod)])}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="O material em números" className="border-border border-b">
        <dl className="divide-border mx-auto grid max-w-7xl grid-cols-2 px-6 lg:grid-cols-4 lg:divide-x">
          {[
            {
              label: "Módulos de conteúdo",
              value: stats.modules,
              detail: "Da álgebra matricial às demonstrações",
            },
            { label: "Tópicos", value: stats.topics, detail: "Com teoria, exemplos e exercícios" },
            {
              label: "Exercícios propostos",
              value: stats.exercises,
              detail: "Com resposta para conferir",
            },
            {
              label: "Provas e listas resolvidas",
              value: stats.assessments,
              detail: `${stats.questions} questões de semestres anteriores`,
            },
          ].map(({ label, value, detail }) => (
            <div key={label} className="py-7 lg:px-8 lg:first:pl-0">
              <dt className="text-muted text-sm">{label}</dt>
              <dd className="text-foreground mt-1 text-3xl font-semibold tracking-[-0.03em] tabular-nums sm:text-4xl">
                {value}
              </dd>
              <dd className="text-muted mt-1 text-sm">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <h2 className={SECTION_TITLE}>Seu semestre</h2>
        <p className="text-muted mt-4 max-w-[60ch] text-lg leading-relaxed">
          Acompanhe o cronograma das aulas e pratique com provas e listas resolvidas de semestres
          anteriores.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <div className="lg:col-span-2 lg:row-span-2">
            <UpcomingClasses />
          </div>
          {plan && <ResourceTile group={plan} Icon={CalendarRange} />}
          {assessments && <ResourceTile group={assessments} Icon={ClipboardCheck} />}
        </div>
      </section>

      {tools.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <h2 className={SECTION_TITLE}>Ferramentas interativas</h2>
            <p className="text-muted mt-4 max-w-[60ch] text-lg leading-relaxed">
              Calculadoras e questões geradas na hora, dentro das próprias páginas de conteúdo, para
              testar cada operação com os seus próprios números.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {tools.map((tool) => (
                <li
                  key={tool.tag}
                  className={`group border-border hover:border-accent/40 hover:shadow-soft rounded-card relative flex flex-col border p-6 transition-[border-color,box-shadow] ${
                    tool.kind === "calculator"
                      ? "bg-background lg:col-span-2"
                      : "bg-surface lg:col-span-3"
                  }`}
                >
                  <span className="bg-accent-soft text-accent rounded-control flex h-10 w-10 items-center justify-center">
                    {tool.kind === "calculator" ? (
                      <Calculator className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Dices className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <h3 className="mt-5 font-semibold tracking-[-0.015em]">
                    <Link
                      href={tool.href}
                      className="text-foreground group-hover:text-accent after:rounded-card transition-colors after:absolute after:inset-0"
                    >
                      {tool.title}
                    </Link>
                  </h3>
                  <p className="text-muted mt-1.5 text-sm leading-relaxed">{tool.description}</p>
                  <p className="text-muted-2 mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium">
                    Em {tool.pageTitle}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-border bg-surface border-y">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10">
          {/* Live components, not a picture of them: they behave exactly as
              they do on a content page. */}
          <div className="relative lg:col-span-6">
            <div className="bg-background shadow-lift rounded-card sm:mr-14 [&>div]:my-0">
              <Callout type="definition" title="Definição: função sobrejetora">
                <p>
                  Uma função <em>f</em> de <em>A</em> em <em>B</em> é sobrejetora quando todo
                  elemento do contradomínio é atingido por algum elemento do domínio:
                </p>
                <div
                  className="not-prose -my-1 overflow-x-auto"
                  dangerouslySetInnerHTML={SURJECTIVE}
                />
              </Callout>
            </div>
            <div className="[&>div]:shadow-lift relative -mt-6 sm:ml-14 [&>div]:my-0">
              <Quiz
                question="Toda função injetora é também sobrejetora?"
                explanation="São propriedades independentes: uma função pode ser injetora sem ser sobrejetora. Quando é as duas ao mesmo tempo, é bijetora."
              >
                <Option>Sim, sempre</Option>
                <Option correct>Não necessariamente</Option>
              </Quiz>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className={SECTION_TITLE}>Leia, teste e confira na mesma página</h2>
            <p className="text-muted mt-4 text-lg leading-relaxed">
              Cada tópico junta a definição, exemplos resolvidos e exercícios com resposta. O quiz
              ao lado funciona de verdade: escolha uma alternativa.
            </p>
            <ul className="mt-8 space-y-5">
              {PAGE_TOOLS.map(({ title, description, Icon }) => (
                <li key={title} className="flex gap-4">
                  <span className="border-border bg-background text-accent rounded-control flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-foreground font-semibold">{title}</h3>
                    <p className="text-muted mt-0.5 text-sm">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/docs/matematica-discreta/funcoes/sobrejetora"
              className="text-accent mt-8 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Abrir a página completa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 sm:py-24 lg:grid-cols-2">
        <div className="border-border bg-background rounded-card flex flex-col border p-8 sm:p-10">
          <h2 className="text-foreground text-2xl font-semibold tracking-[-0.03em] sm:text-[1.75rem]">
            Dúvidas? Fale com a monitoria
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Os monitores da disciplina ajudam com o conteúdo, as listas e a preparação para as
            provas.
          </p>
          <div className="mt-6 grid gap-3">
            {MONITORS.map((monitor) => (
              <ContributorCard
                key={monitor.githubUrl ?? monitor.name}
                name={monitor.name}
                subtitle={githubHandle(monitor.githubUrl) ?? monitor.role}
                href={monitor.githubUrl}
                avatarUrl={getGithubAvatarUrl(monitor.githubUrl)}
              />
            ))}
          </div>
          <Link
            href="/contribuidores"
            className="text-accent-dark dark:text-accent mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Conhecer toda a equipe
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="border-border bg-surface rounded-card flex flex-col border p-8 sm:p-10">
          <h2 className="text-foreground text-2xl font-semibold tracking-[-0.03em] sm:text-[1.75rem]">
            Viu um erro? Corrija no GitHub.
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Todo o material é aberto. Qualquer estudante pode corrigir uma conta, melhorar uma
            explicação ou só avisar do erro pelo formulário.
          </p>
          <ol className="mt-6 space-y-4">
            {FIX_STEPS.map(({ title, description }, index) => (
              <li key={title} className="flex gap-4">
                <span className="border-border-strong bg-background text-accent-dark dark:text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-foreground font-semibold">{title}</h3>
                  <p className="text-muted mt-0.5 text-sm leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            <CtaLink href={REPO_URL} target="_blank" rel="noreferrer">
              Abrir o repositório
            </CtaLink>
            <CtaLink
              href={`${REPO_URL}/issues/new?template=content_issue.yml`}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              Reportar um erro
            </CtaLink>
          </div>
        </div>
      </section>
    </main>
  );
}
