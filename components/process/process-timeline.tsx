import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  [
    "Discovery",
    "Goals, users, constraints, and the real definition of success.",
  ],
  [
    "Planning",
    "A focused scope, technical direction, and transparent roadmap.",
  ],
  ["Design", "Clear flows and a visual system aligned with your positioning."],
  [
    "Development",
    "Maintainable implementation with visible, regular progress.",
  ],
  ["Testing", "Quality, accessibility, performance, and edge cases checked."],
  [
    "Launch",
    "Production setup, analytics, documentation, and a calm handover.",
  ],
  [
    "Support",
    "Post-launch monitoring, iteration, and dependable follow-through.",
  ],
];

export function ProcessTimeline() {
  return (
    <section className="section-pad border-y border-[var(--border)] bg-[var(--surface)]/45">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="Clarity at every stage."
            description="A collaborative delivery process that reduces uncertainty and keeps decisions connected to the outcome."
          />
        </Reveal>
        <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-0">
          <div className="absolute top-5 right-[7%] left-[7%] hidden h-px bg-[var(--border)] lg:block" />
          {steps.map(([title, description], index) => (
            <Reveal key={title} delay={index * 0.04} className="relative">
              <div className="card-surface h-full rounded-2xl p-5 lg:border-0 lg:bg-transparent lg:px-3">
                <span className="relative z-10 grid size-10 place-items-center rounded-full border border-[var(--border-hover)] bg-[var(--surface)] font-mono text-[10px] text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-sm font-bold">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
