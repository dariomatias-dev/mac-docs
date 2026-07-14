import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/features/theme";

import { MobileMenuButton } from "./mobile-menu-button";

export function Header({ search, searchMobile }: { search?: ReactNode; searchMobile?: ReactNode }) {
  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="relative flex h-16 w-full items-center gap-3 px-4 sm:gap-4 sm:px-6 md:px-44 lg:px-56 xl:px-64">
        <MobileMenuButton />

        <Link href="/" aria-label="MACDocs — página inicial" className="text-foreground shrink-0">
          <svg viewBox="20 22 400 74" className="h-7 w-auto" role="img" aria-label="MACDocs">
            <defs>
              <linearGradient id="headerLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0a7194" />
                <stop offset="100%" stopColor="#5ccce4" />
              </linearGradient>
            </defs>
            <g transform="translate(35, 18)">
              <path
                d="M 10,20 L 30,40 L 10,60"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 40,10 C 60,10 50,70 70,70"
                stroke="url(#headerLogoGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="70" cy="70" r="6" fill="currentColor" />
            </g>
            <text
              x="140"
              y="85"
              fontFamily="inherit"
              fontSize="56"
              fontWeight="200"
              fill="currentColor"
            >
              MAC
              <tspan fontWeight="800" fill="url(#headerLogoGradient)">
                Docs
              </tspan>
            </text>
          </svg>
        </Link>

        {search && (
          <div className="absolute top-1/2 left-1/2 hidden w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4 md:block">
            {search}
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <span className="bg-border h-5 w-px" aria-hidden="true" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-2 hover:text-accent flex h-6 w-6 items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58l-.01-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>

      {searchMobile && (
        <div className="border-border border-t px-4 py-2 md:hidden">{searchMobile}</div>
      )}
    </header>
  );
}
