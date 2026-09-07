import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ContactCta } from "@/components/contact/contact-cta";
import { PageHero } from "@/components/ui/page-hero";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "NextWeb Studio builds modern websites, full-stack applications, SaaS products, e-commerce platforms, dashboards, APIs, and AI-powered experiences.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Services"
        title="What NextWeb Studio builds."
        description="Focused development for startups, businesses, professionals, agencies, founders, and product teams—from polished websites to the systems behind them."
      />
      <section className="section-pad">
        <div className="container-shell space-y-5">
          {services.map(
            (
              {
                title,
                description,
                useCases,
                technologies,
                deliverables,
                icon: Icon,
              },
              index,
            ) => (
              <Reveal key={title}>
                <article className="glass-card glass-card-hover grid gap-8 rounded-3xl p-6 sm:p-9 lg:grid-cols-[0.75fr_1.25fr]">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-white/30">
                        0{index + 1}
                      </span>
                      <div className="grid size-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/62 text-[var(--cyan)]">
                        <Icon size={21} />
                      </div>
                    </div>
                    <h2 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
                      {title}
                    </h2>
                    <p className="muted-copy mt-4 text-sm">{description}</p>
                  </div>
                  <div className="grid gap-7 border-t border-[var(--border)] pt-7 sm:grid-cols-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                    <div>
                      <p className="text-xs font-bold tracking-[0.14em] text-white/40 uppercase">
                        Typical use cases
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/75">
                        {useCases}
                      </p>
                      <p className="mt-7 text-xs font-bold tracking-[0.14em] text-white/40 uppercase">
                        Technologies
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/52 px-3 py-1.5 text-xs text-[var(--foreground-secondary)]"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-[0.14em] text-white/40 uppercase">
                        Deliverables
                      </p>
                      <ul className="mt-3 grid gap-3">
                        {deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 text-sm text-white/75"
                          >
                            <Check size={15} className="text-[var(--accent)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ),
          )}
        </div>
      </section>
      <ContactCta />
    </PageTransition>
  );
}
