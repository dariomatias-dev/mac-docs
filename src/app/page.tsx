import { ThemeToggle } from "@/features/theme";

export default function Home() {
  return (
    <main className="bg-background text-foreground flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <ThemeToggle />
      <h1 className="text-3xl font-semibold tracking-tight">MacDocs</h1>
      <p className="text-muted-foreground max-w-md text-center">
        Documentação interativa de Matemática Aplicada à Computação.
      </p>
    </main>
  );
}
