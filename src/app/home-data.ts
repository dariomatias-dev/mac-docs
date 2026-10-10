import { getAllDocs, type Doc } from "@/features/content";
import { getSidebarTree, type SidebarCourse, type SidebarGroup } from "@/features/navigation";

// Home page data that combines content (the MDX sources) and navigation (the
// sidebar tree). It lives in the app layer for the same reason as
// build-doc-view.ts: features don't import each other.

const ASSESSMENTS_FOLDER = "avaliacoes";

const folderOf = (group: SidebarGroup) => group.slug[group.slug.length - 1];

function pageCount(group: SidebarGroup): number {
  return group.pages.length + group.groups.reduce((total, sub) => total + pageCount(sub), 0);
}

function countTag(docs: Doc[], tag: string): number {
  const pattern = new RegExp(`<${tag}[\\s/>]`, "g");
  return docs.reduce((total, doc) => total + (doc.content.match(pattern)?.length ?? 0), 0);
}

export type MaterialStats = {
  modules: number;
  topics: number;
  exercises: number;
  assessments: number;
  questions: number;
};

/** Real counts of the course material, read from the content at build time. */
export function getMaterialStats(
  tree: SidebarCourse[] = getSidebarTree(),
  docs: Doc[] = getAllDocs(),
): MaterialStats {
  const groups = tree.flatMap((course) => course.groups);
  const modules = groups.filter((group) => group.kind === "module");
  const assessmentGroups = groups.filter((group) => folderOf(group) === ASSESSMENTS_FOLDER);
  const assessmentDocs = docs.filter((doc) =>
    assessmentGroups.some((group) => doc.url.startsWith(`${group.href}/`)),
  );

  return {
    modules: modules.length,
    topics: modules.reduce((total, module) => total + pageCount(module), 0),
    exercises: countTag(docs, "Exercise"),
    assessments: assessmentGroups.reduce((total, group) => total + pageCount(group), 0),
    questions: countTag(assessmentDocs, "Question"),
  };
}

export type InteractiveTool = {
  tag: string;
  title: string;
  description: string;
  kind: "calculator" | "generator";
};

export const INTERACTIVE_TOOLS: InteractiveTool[] = [
  {
    tag: "MatrixCalculator",
    title: "Calculadora de matrizes",
    description:
      "Soma, subtração, multiplicação e operações encadeadas com matrizes que você define.",
    kind: "calculator",
  },
  {
    tag: "SetCalculator",
    title: "Calculadora de conjuntos",
    description: "União, interseção, diferença e diferença simétrica entre dois conjuntos.",
    kind: "calculator",
  },
  {
    tag: "BooleanMatrixCalculator",
    title: "Calculadora de matrizes booleanas",
    description: "Soma booleana, produto booleano e produto de matrizes de bits.",
    kind: "calculator",
  },
  {
    tag: "MatrixExercise",
    title: "Questões de matrizes",
    description: "Uma questão nova a cada clique, com a resposta para conferir.",
    kind: "generator",
  },
  {
    tag: "BooleanMatrixExercise",
    title: "Questões de matrizes booleanas",
    description: "Pratique operações booleanas com questões geradas na hora.",
    kind: "generator",
  },
];

/** Each interactive tool with the page that embeds it; tools not used in any page are left out. */
export function getInteractiveTools(docs: Doc[] = getAllDocs()) {
  return INTERACTIVE_TOOLS.flatMap((tool) => {
    const pattern = new RegExp(`<${tool.tag}[\\s/>]`);
    const doc = docs.find((candidate) => pattern.test(candidate.content));
    return doc ? [{ ...tool, href: doc.url, pageTitle: doc.frontmatter.title }] : [];
  });
}
