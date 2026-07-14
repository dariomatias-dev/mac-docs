import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Footer, Header } from "@/features/navigation";
import { SidebarCollapseProvider, SidebarGroupsProvider } from "@/features/navigation";
import { SearchButton, SearchDialog } from "@/features/search";
import { ThemeProvider } from "@/features/theme";
import { jsonLd } from "@/shared/lib/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/shared/lib/site";
import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              inLanguage: "pt-BR",
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="focus:bg-accent focus:text-accent-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
          >
            Pular para o conteúdo
          </a>
          <SidebarGroupsProvider>
            <SidebarCollapseProvider>
              <ActiveMobileSheetProvider>
                <Header search={<SearchDialog />} searchMobile={<SearchButton />} />
                <div id="main-content" className="flex flex-1 flex-col">
                  {children}
                </div>
                <Footer />
              </ActiveMobileSheetProvider>
            </SidebarCollapseProvider>
          </SidebarGroupsProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
