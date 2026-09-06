import type { Metadata } from "next";
import { Compass, HeartHandshake, Lightbulb, Scale } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ContactCta } from "@/components/contact/contact-cta";
import { TechnologyGrid } from "@/components/skills/technology-grid";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NextWeb Studio and Vinay Kumar, the full-stack developer behind the independent development studio.",
};

const values = [
  [
    "Clarity first",
    "Make the problem and priorities understandable before writing code.",
    Compass,
  ],
  [
    "Useful over novel",
    "Choose technology for long-term product value, not theatre.",
    Lightbulb,
  ],
  [
    "Quality with pace",
    "Move deliberately without letting craft become a bottleneck.",
    Scale,
  ],
  [
    "True partnership",
    "Share context, surface tradeoffs, and take ownership of outcomes.",
    HeartHandshake,
  ],
];

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="About NextWeb Studio"
        title="Independent studio. Full-product perspective."
        description="NextWeb Studio is the professional development identity of Vinay Kumar, focused on designing and building clear, dependable digital products."
      />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <span className="eyebrow">About the developer</span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Vinay Kumar
            </h2>
            <p className="mt-3 text-sm text-[var(--accent)]">
              Full Stack Developer · Founder, NextWeb Studio
            </p>
          </Reveal>
          <Reveal
            delay={0.08}
            className="space-y-6 text-lg leading-8 text-[var(--muted)]"
          >
            <p>
              I work across interface design, frontend engineering, backend
              development, APIs, database architecture, deployment, and product
              decisions. That range keeps the experience and the systems behind
              it connected.
            </p>
            <p>
              NextWeb Studio works with founders, businesses, professionals,
              agencies, startups, and product teams that need focused technical
              ownership without the overhead of a large agency.
            </p>
          </Reveal>
        </div>
      </section>
      <TechnologyGrid />
      <section className="section-pad">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Principles"
              title="The standard behind the work."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {values.map(([title, copy, Icon], index) => (
              <Reveal key={title as string} delay={index * 0.04}>
                <article className="card-surface rounded-2xl p-7 sm:p-9">
                  <Icon className="text-[var(--accent)]" size={24} />
                  <h3 className="mt-8 text-xl font-bold">{title as string}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {copy as string}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad border-y border-[var(--border)] bg-[var(--surface)]/45">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Studio and developer"
              title="One identity, clearly connected."
            />
          </Reveal>
          <div className="mt-12 border-l border-[var(--border)]">
            {[
              [
                "Studio",
                "NextWeb Studio",
                "An independent software development studio for modern websites, applications, e-commerce platforms, SaaS products, and AI-powered experiences.",
              ],
              [
                "Founder",
                "Vinay Kumar",
                "Full Stack Developer and the person responsible for the studio’s product thinking, design decisions, engineering, and delivery.",
              ],
              [
                "Approach",
                "Interface to infrastructure",
                "A focused development process spanning frontend craft, backend systems, databases, integrations, performance, and deployment.",
              ],
            ].map(([year, title, copy]) => (
              <div
                key={year}
                className="relative grid gap-3 border-b border-[var(--border)] py-8 pl-8 md:grid-cols-[9rem_1fr_1.3fr]"
              >
                <span className="absolute top-10 -left-1 size-2 rounded-full bg-[var(--accent)]" />
                <span className="font-mono text-xs text-[var(--accent)]">
                  {year}
                </span>
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm leading-7 text-[var(--muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </PageTransition>
  );
}
