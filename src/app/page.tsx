import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-foreground text-4xl font-bold tracking-tight">mac-docs</h1>
      <p className="text-muted-2 max-w-md text-lg">
        Documentação interativa de Matemática Aplicada à Computação.
      </p>
      <Link
        href="/docs/calculo-1/limites"
        className="bg-accent text-accent-foreground rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        Começar a estudar
      </Link>
    </main>
  );
}
