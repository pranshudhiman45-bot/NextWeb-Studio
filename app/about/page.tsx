import { pageMetadata } from "@/lib/metadata";
import { Compass, HeartHandshake, Lightbulb, Scale } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { TechnologyGrid } from "@/components/skills/technology-grid";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = pageMetadata(
  "About",
  "Meet Pranshu Dhiman, the Full Stack Developer and founder behind NextWeb Studio, and explore his approach to building digital products.",
  "/about",
);

const values = [
  [
    "Clarity first",
    "Make the problem and priorities understandable before writing code.",
    Compass,
  ],
  [
    "Useful over novel",
    "Choose tools that fit the problem and remain practical to maintain.",
    Lightbulb,
  ],
  [
    "Quality with pace",
    "Agree on scope, share progress, and test the details before launch.",
    Scale,
  ],
  [
    "Direct collaboration",
    "Explain decisions clearly and discuss tradeoffs as the project develops.",
    HeartHandshake,
  ],
];

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="About NextWeb Studio"
        title="One developer. Frontend to backend."
        description="NextWeb Studio is the professional development identity of Pranshu Dhiman, focused on designing and building clear, dependable digital products."
      />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <span className="eyebrow">About the developer</span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Pranshu Dhiman
            </h2>
            <p className="mt-3 text-sm text-[var(--accent)]">
              Full Stack Developer · Founder &amp; Owner, NextWeb Studio
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
              I help founders and businesses plan what to build, connect the
              frontend to the right data and APIs, and prepare the product for
              deployment and ongoing maintenance.
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
    </PageTransition>
  );
}
