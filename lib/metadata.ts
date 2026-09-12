import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — built by ${siteConfig.founder}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/twitter-image"],
    },
  };
}
