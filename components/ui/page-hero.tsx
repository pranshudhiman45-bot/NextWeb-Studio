import { Reveal } from "@/components/animations/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] pt-40 pb-20 sm:pt-48 sm:pb-28">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -top-48 right-[8%] size-[32rem] rounded-full bg-[radial-gradient(circle,rgba(0,126,255,0.11),rgba(16,217,245,0.025)_42%,transparent_70%)] blur-2xl max-sm:size-80" />
      <div className="container-shell relative">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display-title mt-7 max-w-5xl">{title}</h1>
          <p className="muted-copy mt-7 max-w-2xl text-base sm:text-lg">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
