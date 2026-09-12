import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/lib/utils";
import { themeScript } from "@/components/theme/theme-config";
import { ThemeSync } from "@/components/theme/theme-store";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "NextWeb Studio — Full Stack Web Development",
    template: "%s — NextWeb Studio",
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "NextWeb Studio — Full Stack Web Development",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NextWeb Studio — built by Pranshu Dhiman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextWeb Studio — Full Stack Web Development",
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#020b18" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
      jobTitle: siteConfig.founderTitle,
    },
    sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top">
        <ThemeSync />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="fixed top-3 left-4 z-[100] -translate-y-20 rounded-md bg-[var(--button-primary)] px-4 py-2 font-bold text-white focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <div id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
