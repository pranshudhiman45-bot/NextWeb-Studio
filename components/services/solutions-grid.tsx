"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { solutions } from "@/lib/content";

export function SolutionsGrid() {
  const reduced = useReducedMotion();

  return (
    <section className="section-pad">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="Digital products, built end to end."
            description="NextWeb Studio connects product decisions, interface craft, and full-stack engineering from first scope to production."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ title, description, icon: Icon }, index) => (
            <Reveal
              key={title}
              delay={(index % 3) * 0.05}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <motion.div
                className="h-full"
                whileHover={reduced ? undefined : { y: -3 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/services"
                  className="group glass-card glass-card-hover flex h-full min-h-64 flex-col rounded-2xl p-6 sm:p-8"
                >
                  <div className="grid size-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/62 text-[var(--cyan)] backdrop-blur-md transition-colors group-hover:border-[var(--border-hover)] group-hover:bg-[var(--surface-strong)]/68">
                    <Icon size={21} />
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="text-xl font-bold tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
                      {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-white/55 uppercase group-hover:text-[var(--accent)]">
                      Learn more <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
