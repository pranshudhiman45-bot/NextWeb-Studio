export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function publicHttpUrl(value?: string, originOnly = false) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? originOnly
        ? url.origin
        : url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function resolveSiteUrl(publicSiteUrl?: string, vercelUrl?: string) {
  const configured = publicHttpUrl(publicSiteUrl, true);
  if (configured) return configured;

  const deployment = vercelUrl?.trim();
  if (deployment) {
    // Vercel normally supplies a hostname; also accept an existing HTTP(S)
    // scheme without adding a second one. Reject other schemes safely.
    const absolute = /^[a-z][a-z\d+.-]*:/i.test(deployment)
      ? deployment
      : `https://${deployment}`;
    const fallback = publicHttpUrl(absolute, true);
    if (fallback) return fallback;
  }
  return "http://localhost:3000";
}

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "pranshudhiman89@gmail.com";

export const siteConfig = {
  name: "NextWeb Studio",
  founder: "Pranshu Dhiman",
  founderTitle: "Full Stack Developer",
  title: "Full Stack Web Development",
  description:
    "NextWeb Studio builds modern websites, full-stack applications, e-commerce platforms, SaaS products and AI-powered digital experiences.",
  positioning:
    "Modern websites, full-stack applications and AI-powered digital products.",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_URL),
  github: publicHttpUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  linkedin: publicHttpUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  calendar: publicHttpUrl(process.env.NEXT_PUBLIC_CAL_URL),
  email: contactEmail,
};
