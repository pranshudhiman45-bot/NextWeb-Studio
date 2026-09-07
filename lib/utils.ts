export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const siteConfig = {
  name: "NextWeb Studio",
  founder: "Pranshu Dhiman",
  founderTitle: "Full Stack Developer",
  title: "Websites, Full Stack & AI Development",
  description:
    "NextWeb Studio is an independent development studio by Pranshu Dhiman, building modern websites, full-stack applications, SaaS products, e-commerce platforms and AI-powered experiences.",
  positioning:
    "Modern websites, full-stack applications and AI-powered digital products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  github: process.env.NEXT_PUBLIC_GITHUB_URL,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  calendar: process.env.NEXT_PUBLIC_CAL_URL,
  email: contactEmail,
};
