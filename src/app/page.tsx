import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  ClipboardCopy,
  FolderTree,
  ListChecks,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { getSidebarTree } from "@/features/navigation";
import { Callout, Option, Quiz } from "@/features/study";

const FEATURES: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Teoria rigorosa",
    description: "Definições formais com notação LaTeX, do conceito intuitivo à demonstração.",
    Icon: BookOpen,
  },
  {
    title: "Exemplos resolvidos",
    description: "Passo a passo expansível e exercícios com resposta revelável em cada tópico.",
    Icon: ListChecks,
  },
  {
    title: "Componentes de estudo",
    description: "Quizzes, callouts e resoluções interativas integrados ao conteúdo.",
    Icon: Sparkles,
  },
  {
    title: "Navegação hierárquica",
    description: "Sidebar por seções, sempre com breadcrumbs e navegação anterior/próximo.",
    Icon: FolderTree,
  },
  {
    title: "Busca rápida (Ctrl K)",
    description: "Encontre qualquer página do conteúdo em segundos, sem tirar a mão do teclado.",
    Icon: Search,
  },
  {
    title: "Copiar para IA",
    description: "Copie o texto de uma página ou de uma seção inteira com um clique.",
    Icon: ClipboardCopy,
  },
];

export default function Home() {
  const modules = getSidebarTree().flatMap((course) =>
    course.groups.map((group) => ({
      title: group.title,
      href: group.href,
      topics: group.pages.map((page) => page.title).join(", ") || course.title,
    })),
  );

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-20">
        <div className="from-accent-dark via-accent mb-1 bg-linear-to-br to-[#58c4dc] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-[3.5rem] sm:leading-16">
          MacDocs
        </div>
        <h1 className="text-foreground max-w-3xl text-4xl font-bold tracking-tight sm:text-[3.5rem] sm:leading-16">
          Documentação interativa de Matemática Aplicada à Computação
        </h1>
        <p className="text-muted mt-4 max-w-xl text-2xl leading-9">
          Teoria rigorosa, exemplos resolvidos e componentes interativos, tudo que você precisa para
          dominar os cálculos e fundamentos da disciplina.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/calculo-1/limites/conceito-intuitivo"
            className="bg-accent text-accent-foreground flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/referencia/formulas"
            className="bg-surface-2 text-foreground hover:bg-border rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Referência rápida
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="border-border bg-background hover:border-accent rounded-[10px] border p-5 transition-[border-color,box-shadow] hover:shadow-[0_2px_16px_rgba(10,113,148,0.1)]"
            >
              <span className="bg-accent-soft text-accent mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-foreground mb-1.5 font-bold">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">Veja em ação</h2>
        <p className="text-muted mb-8 max-w-2xl text-base leading-relaxed">
          O conteúdo não é só texto: cada página combina teoria com componentes que você resolve na
          hora.
        </p>

        <div className="max-w-2xl">
          <Callout type="definition" title="Definição">
            O limite descreve o comportamento de uma função no entorno de um ponto, mesmo que ela
            não esteja definida ali.
          </Callout>

          <Quiz
            question="O limite de uma função em um ponto depende do valor dela nesse ponto?"
            explanation="O limite olha apenas o entorno do ponto, não o valor exato nele."
          >
            <Option>Sim, sempre</Option>
            <Option correct>Não necessariamente</Option>
          </Quiz>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
          O que você vai encontrar aqui
        </h2>
        <p className="text-muted mb-4 max-w-2xl text-base leading-relaxed">
          Este é o material de estudo da disciplina de{" "}
          <strong className="text-foreground">Matemática Aplicada à Computação (MAC)</strong> do
          curso de Análise e Desenvolvimento de Sistemas do IFPB, Campus Esperança.
        </p>
        <p className="text-muted mb-10 max-w-2xl text-base leading-relaxed">
          Tudo é apresentado como uma documentação navegável e buscável: a teoria da disciplina, com
          definições, exemplos resolvidos e exercícios.
        </p>

        <h3 className="text-foreground mb-4 text-xl font-bold tracking-tight">
          Módulos disponíveis
        </h3>
        <div className="border-border mb-10 overflow-hidden rounded-xl border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-muted px-4 py-2.5 text-xs font-semibold tracking-wide uppercase">
                  Módulo
                </th>
                <th className="text-muted px-4 py-2.5 text-xs font-semibold tracking-wide uppercase">
                  Tópicos
                </th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod.href} className="border-border border-t">
                  <td className="px-4 py-2.5 font-medium">
                    <Link href={mod.href} className="text-accent underline underline-offset-2">
                      {mod.title}
                    </Link>
                  </td>
                  <td className="text-muted px-4 py-2.5">{mod.topics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-foreground mb-4 text-xl font-bold tracking-tight">
          Começando do zero?
        </h3>
        <ol className="text-foreground list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>Entenda a notação usada na documentação: funções, limites e ε-δ.</li>
          <li>
            Comece por{" "}
            <Link
              href="/docs/calculo-1/limites"
              className="text-accent underline underline-offset-2"
            >
              Limites
            </Link>
            , a base de tudo o que vem depois.
          </li>
          <li>
            Siga para{" "}
            <Link
              href="/docs/calculo-1/derivadas"
              className="text-accent underline underline-offset-2"
            >
              Derivadas
            </Link>{" "}
            quando limites estiverem confortáveis.
          </li>
          <li>
            Use a{" "}
            <Link
              href="/docs/referencia/formulas"
              className="text-accent underline underline-offset-2"
            >
              Referência rápida
            </Link>{" "}
            para consultar fórmulas durante os estudos.
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">Como contribuir</h2>
        <p className="text-muted mb-6 max-w-2xl text-base leading-relaxed">
          O conteúdo é aberto. Para adicionar ou corrigir uma página, edite um arquivo{" "}
          <code className="text-accent-dark font-mono text-sm">.mdx</code> na pasta{" "}
          <code className="text-accent-dark font-mono text-sm">content/</code> e abra um pull
          request. Não é preciso alterar código: criar o arquivo já gera a rota, a sidebar e a
          busca.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/dariomatias-dev/mac-docs"
            target="_blank"
            rel="noreferrer"
            className="bg-surface-2 text-foreground hover:bg-border rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Repositório no GitHub
          </a>
          <a
            href="https://github.com/dariomatias-dev/mac-docs/blob/main/docs/pt/authoring.md"
            target="_blank"
            rel="noreferrer"
            className="bg-surface-2 text-foreground hover:bg-border rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Guia de autoria
          </a>
        </div>
      </section>
    </main>
  );
}
