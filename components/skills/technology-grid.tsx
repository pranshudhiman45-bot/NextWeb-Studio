"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2 } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologies } from "@/lib/content";

export function TechnologyGrid() {
  const reduced = useReducedMotion();

  return (
    <section className="section-pad border-y border-[var(--border)] bg-[var(--surface)]/45">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Technology"
            title="A pragmatic stack for ambitious products."
            description="The studio chooses proven tools around your users, goals, and operating constraints—not trends for their own sake."
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(technologies).map(([category, items], index) => (
            <Reveal key={category} delay={index * 0.06} className="h-full">
              <motion.div
                initial="rest"
                animate="rest"
                whileHover={reduced ? undefined : "hover"}
                variants={{
                  rest: { y: 0 },
                  hover: { y: -2 },
                }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full bg-[var(--surface)] p-6 transition-colors duration-300 hover:bg-[var(--surface-elevated)] sm:p-8"
              >
                <div className="mb-7 flex items-center gap-3">
                  <motion.span
                    variants={{
                      rest: { rotate: 0, scale: 1 },
                      hover: { rotate: -5, scale: 1.06 },
                    }}
                    className="text-[var(--accent)]"
                  >
                    <Code2 size={17} />
                  </motion.span>
                  <h3 className="font-bold">{category}</h3>
                </div>
                <ul className="grid gap-3 text-sm text-[var(--muted)]">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="group/item flex items-center gap-2 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-px w-0 bg-[var(--accent)] transition-all duration-200 group-hover/item:w-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
