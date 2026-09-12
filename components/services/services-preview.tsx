import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/content";

export function ServicesPreview() {
  return (
    <section className="section-pad">
      <div className="container-shell grid gap-14 lg:grid-cols-[0.72fr_1fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Services"
            title="Development services for your next step."
            description="From a new website to an existing application that needs attention, choose support that fits your stage."
          />
          <ButtonLink href="/services" className="mt-8">
            View all services
          </ButtonLink>
        </Reveal>
        <div className="border-t border-[var(--border)]">
          {services
            .filter((service) =>
              [
                "website-development",
                "full-stack-applications",
                "e-commerce",
                "maintenance-support",
              ].includes(service.id),
            )
            .map(({ title, description, icon: Icon }, index) => (
              <Reveal key={title}>
                <div className="group grid gap-4 border-b border-[var(--border)] py-7 sm:grid-cols-[3rem_1fr_auto] sm:items-start">
                  <span className="font-mono text-xs text-[var(--foreground-muted)]">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold transition-colors group-hover:text-[var(--accent)]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
                      {description}
                    </p>
                  </div>
                  <Icon
                    size={20}
                    className="hidden text-[var(--foreground-muted)] transition group-hover:text-[var(--accent)] sm:block"
                  />
                </div>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}
