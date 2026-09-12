import { Check } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button-link";

const principles = [
  "Business-aware engineering",
  "Interfaces people understand",
  "Systems teams can maintain",
  "Quality without unnecessary complexity",
];

export function AboutPreview() {
  return (
    <section className="section-pad">
      <div className="container-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="eyebrow">About NextWeb Studio</span>
          <h2 className="section-title mt-6">
            Work directly with the developer.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="muted-copy text-lg">
            Pranshu Dhiman brings the interface, APIs, and data model together,
            with one point of contact from project planning to delivery.
          </p>
          <p className="muted-copy mt-5">
            Start with the problem your users need to solve, agree on a useful
            first version, and build it in clear, reviewable steps.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle} className="flex items-center gap-3 text-sm">
                <span className="grid size-6 place-items-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Check size={13} />
                </span>
                {principle}
              </li>
            ))}
          </ul>
          <ButtonLink href="/about" variant="secondary" className="mt-8">
            About the Studio
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
