import { ThemeToggle } from "@/features/theme";
import { REPO_URL } from "@/shared/lib/repo";

import { GitHubLink } from "./github-link";
import { HeaderNav } from "./header-nav";
import { HeaderOverflowMenu } from "./header-overflow-menu";
import { Logo } from "./logo";

import type { ReactNode } from "react";

/** Site header for every page outside /docs (see SiteChrome). */
export function Header({ search, searchMobile }: { search?: ReactNode; searchMobile?: ReactNode }) {
  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />

        <HeaderNav />

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {search && <div className="mr-2 hidden w-64 md:block">{search}</div>}
          {searchMobile && <div className="md:hidden">{searchMobile}</div>}
          <HeaderOverflowMenu />
          <ThemeToggle />
          <GitHubLink href={REPO_URL} />
        </div>
      </div>
    </header>
  );
}
