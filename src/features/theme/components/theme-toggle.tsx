"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-muted-2 hover:text-accent flex h-6 w-6 cursor-pointer items-center justify-center transition-colors"
    >
      <Sun className="h-4.5 w-4.5 dark:hidden" />
      <Moon className="hidden h-4.5 w-4.5 dark:block" />
    </button>
  );
}
