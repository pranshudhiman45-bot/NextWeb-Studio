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
            title="What NextWeb Studio builds."
            description="A focused development partnership for modern websites, full-stack applications, e-commerce, SaaS, AI integrations, and the systems behind them."
          />
          <ButtonLink href="/contact?source=services" className="mt-8">
            Discuss your project
          </ButtonLink>
        </Reveal>
        <div className="border-t border-[var(--border)]">
          {services.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title}>
              <div className="group grid gap-4 border-b border-[var(--border)] py-7 sm:grid-cols-[3rem_1fr_auto] sm:items-start">
                <span className="font-mono text-xs text-white/30">
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
                  className="hidden text-white/25 transition group-hover:text-[var(--accent)] sm:block"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
