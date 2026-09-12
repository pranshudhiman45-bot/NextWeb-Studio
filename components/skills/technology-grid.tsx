"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2 } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologies } from "@/lib/content";

export function TechnologyGrid() {
  const reduced = useReducedMotionPreference();
  const flowRef = useRef<HTMLOListElement>(null);
  const flowVisible = useInView(flowRef, { once: true, amount: 0.7 });

  return (
    <section className="section-pad border-y border-[var(--border)] bg-[var(--surface)]/45">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Technology"
            title="Tools used in the work."
            description="The core tools behind this site and the project implementations. The final stack depends on your application and hosting needs."
          />
        </Reveal>
        <ol
          ref={flowRef}
          aria-label="Technology connection flow"
          className="mt-10 grid grid-cols-4"
        >
          {["Frontend", "Backend", "Database", "Deployment"].map(
            (label, index) => (
              <li key={label} className="relative text-center">
                {index < 3 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 left-1/2 h-px w-full bg-[var(--border)]"
                  >
                    <motion.span
                      className="block h-full origin-left bg-[#2e90ff]/70"
                      initial={false}
                      animate={{ scaleX: reduced || flowVisible ? 1 : 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.7,
                        delay: reduced ? 0 : index * 0.65 + 0.2,
                      }}
                    />
                  </span>
                ) : null}
                <motion.span
                  aria-hidden="true"
                  className="relative z-10 mx-auto block size-2 rounded-full border border-[var(--cyan)] bg-[var(--surface-strong)]"
                  initial={false}
                  animate={{ opacity: reduced || flowVisible ? 1 : 0.35 }}
                  transition={{
                    duration: reduced ? 0 : 0.5,
                    delay: reduced ? 0 : index * 0.65,
                  }}
                />
                <span className="mt-3 block text-[10px] font-medium tracking-wide text-[var(--foreground-secondary)] sm:text-xs">
                  {label}
                </span>
              </li>
            ),
          )}
        </ol>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
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
                      className="group/item flex items-center gap-2 transition-colors duration-200 hover:text-[var(--foreground)]"
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
