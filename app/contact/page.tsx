import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Calendar, Clock3, Mail } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/lib/utils";
import { getProjectTypeFromQuery } from "@/lib/validations";

export const metadata = pageMetadata(
  "Contact",
  "Discuss your website, application or integration with Pranshu Dhiman at NextWeb Studio.",
  "/contact",
);

const allowedSources = new Set([
  "contact-page",
  "homepage",
  "services",
  "cta",
  "solution-selector",
  "project-page",
  "showcase-ecommerce",
  "product-reveal",
]);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    project?: string | string[];
    source?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const projectQuery = Array.isArray(query.project)
    ? query.project[0]
    : query.project;
  const sourceQuery = Array.isArray(query.source)
    ? query.source[0]
    : query.source;
  const initialProjectType = getProjectTypeFromQuery(projectQuery);
  const source =
    sourceQuery && allowedSources.has(sourceQuery)
      ? sourceQuery
      : "contact-page";

  return (
    <PageTransition>
      <PageHero
        eyebrow="Start a project"
        title="Let’s build your next product."
        description="Tell me what you’re working on and I’ll get back to you about how NextWeb Studio can help."
      />
      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.62fr_1.38fr]">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <h2 className="text-2xl font-bold tracking-tight">
                Work directly with the founder.
              </h2>
              <p className="muted-copy mt-4 text-sm">
                Share your goals, scope, and timing so Pranshu Dhiman can review
                the project. You can also use the email link below.
              </p>
              <div className="mt-8 grid gap-3">
                {siteConfig.email ? (
                  <Link
                    href={`mailto:${siteConfig.email}`}
                    target="_blank"
                    className="card-surface flex items-center gap-4 rounded-2xl p-5 transition hover:border-[var(--border-hover)]"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                      <Mail size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-[var(--foreground-muted)]">
                        Email me
                      </span>
                      <span className="mt-1 block text-sm font-semibold break-words">
                        {siteConfig.email}
                      </span>
                    </span>
                  </Link>
                ) : null}
                {siteConfig.calendar ? (
                  <Link
                    href={siteConfig.calendar}
                    target="_blank"
                    className="card-surface flex items-center gap-4 rounded-2xl p-5 transition hover:border-[var(--border-hover)]"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                      <Calendar size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-[var(--foreground-muted)]">
                        Book a call
                      </span>
                      <span className="mt-1 block text-sm font-semibold break-words">
                        Find a time that works
                      </span>
                    </span>
                  </Link>
                ) : null}
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                <Clock3 size={17} /> Built and led by {siteConfig.founder}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm
              key={`${initialProjectType ?? "default"}:${source}`}
              initialProjectType={initialProjectType}
              source={source}
            />
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
