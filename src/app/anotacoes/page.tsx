import type { Metadata } from "next";

import { AnnotationsListPage } from "@/features/annotations";

export const metadata: Metadata = {
  title: "Anotações",
  description: "Todas as suas anotações, de todas as páginas.",
  alternates: { canonical: "/anotacoes" },
  robots: { index: false, follow: true },
};

export default function AnotacoesPage() {
  return <AnnotationsListPage />;
}
