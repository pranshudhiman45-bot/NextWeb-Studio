import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/lib/utils";

export function ContactCta() {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="cta-panel relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
          <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full border border-[var(--border)] opacity-35" />
          <div className="pointer-events-none absolute top-8 right-6 size-36 rounded-full border border-[var(--cyan)]/10" />
          <div className="grid-lines pointer-events-none absolute top-0 right-0 h-56 w-80 opacity-[0.08]" />
          <p className="relative font-mono text-xs font-bold tracking-[0.15em] text-[var(--accent)] uppercase">
            Start a project
          </p>
          <h2 className="relative mt-5 max-w-4xl text-4xl font-bold tracking-[-0.055em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
            Have an idea?
            <span className="block">Let’s build something great.</span>
          </h2>
          <p className="relative mt-6 max-w-xl text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
            Tell NextWeb Studio what you’re planning and let’s turn it into a
            fast, polished and scalable digital product.
          </p>
          <div className="relative mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact?source=cta">Start a Project</ButtonLink>
            {siteConfig.calendar ? (
              <ButtonLink
                href={siteConfig.calendar}
                external
                variant="secondary"
              >
                Book a Call
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
