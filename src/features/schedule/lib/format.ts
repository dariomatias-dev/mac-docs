function toDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "terça-feira, 13 de outubro" */
export function formatClassDate(isoDate: string) {
  return toDate(isoDate).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "13 de out." */
export function formatShortClassDate(isoDate: string) {
  return toDate(isoDate).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}
