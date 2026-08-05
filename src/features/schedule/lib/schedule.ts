export type ClassSession = {
  /** ISO date (YYYY-MM-DD), local wall-clock date of the class. */
  date: string;
  topic: string;
};

export const CLASS_SCHEDULE: ClassSession[] = [
  { date: "2026-08-04", topic: "Apresentação da disciplina; Álgebra matricial" },
  { date: "2026-08-11", topic: "Conceito de conjunto" },
  { date: "2026-08-18", topic: "Operações sobre conjuntos" },
  { date: "2026-08-25", topic: "Propriedades de conjuntos" },
  { date: "2026-09-01", topic: "Conjuntos e sua cardinalidade" },
  { date: "2026-09-08", topic: "Avaliação 1" },
  { date: "2026-09-15", topic: "Relações; domínio e imagem de uma relação" },
  { date: "2026-09-22", topic: "Funções; funções injetoras, sobrejetoras, bijetoras" },
  { date: "2026-09-29", topic: "Composição de funções" },
  { date: "2026-10-06", topic: "Função inversa; operações com funções" },
  { date: "2026-10-13", topic: "Funções polinomiais" },
  { date: "2026-10-20", topic: "Avaliação 2" },
  { date: "2026-10-27", topic: "Técnicas de demonstração: direta; contrapositiva" },
  { date: "2026-11-03", topic: "Contradição; indução" },
  { date: "2026-11-10", topic: "Recursão matemática: definição formal" },
  { date: "2026-11-17", topic: "Recursão: aplicação em computação" },
  { date: "2026-11-24", topic: "Avaliação 3" },
  { date: "2026-12-15", topic: "Reposição" },
  { date: "2026-12-22", topic: "Recuperação final" },
];

function todayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Next class: today's, if it hasn't passed yet; otherwise the first upcoming one. */
export function getNextClass(schedule: ClassSession[] = CLASS_SCHEDULE): ClassSession | null {
  const today = todayLocalDateString();
  return schedule.find((session) => session.date >= today) ?? null;
}
