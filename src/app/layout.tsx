import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer, Header, SiteChrome } from "@/features/navigation";
import { SidebarCollapseProvider, SidebarGroupsProvider } from "@/features/navigation";
import { SearchButton, SearchDialog } from "@/features/search";
import { ThemeProvider } from "@/features/theme";
import { jsonLd } from "@/shared/lib/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/shared/lib/site";
import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import type { Metadata } from "next";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    images: [{ url: "/og", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og"],
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
      // Smooth scrolling is for in-page anchors (TOC, "voltar ao topo"); this
      // attribute makes Next.js jump instantly on route changes instead.
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
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
            className="focus:bg-accent focus:text-accent-foreground focus:rounded-control sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
          >
            Pular para o conteúdo
          </a>
          <SidebarGroupsProvider>
            <SidebarCollapseProvider>
              <ActiveMobileSheetProvider>
                <SiteChrome>
                  <Header search={<SearchDialog />} searchMobile={<SearchButton />} />
                </SiteChrome>
                <div id="main-content" className="flex flex-1 flex-col">
                  {children}
                </div>
                <SiteChrome>
                  <Footer />
                </SiteChrome>
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
