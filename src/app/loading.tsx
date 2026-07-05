import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Loader2 className="text-accent h-8 w-8 animate-spin" />
      <p className="text-muted mt-4 text-sm">Carregando…</p>
    </main>
  );
}
