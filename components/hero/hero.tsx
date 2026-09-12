"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductPipeline } from "@/components/hero/product-pipeline";
import { siteConfig } from "@/lib/utils";

export function Hero() {
  const reduced = useReducedMotionPreference();

  return (
    <section className="relative flex min-h-[920px] items-center overflow-hidden pt-28 sm:min-h-screen">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute -top-36 right-[8%] size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,126,255,0.13),transparent_68%)] blur-2xl max-sm:size-80 max-sm:opacity-65" />
      <div className="pointer-events-none absolute bottom-[10%] left-[-12rem] size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(16,217,245,0.055),transparent_70%)] blur-3xl max-sm:hidden" />
      <div className="container-shell relative grid items-center gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/72 px-3 py-2 text-xs font-semibold text-[var(--foreground-secondary)] shadow-[inset_0_1px_0_rgba(133,194,255,0.06)] backdrop-blur-xl"
          >
            <span className="size-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_var(--accent)]" />
            NextWeb Studio
          </motion.div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="display-title max-w-4xl"
          >
            Modern websites. Full-stack apps.{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)] bg-clip-text text-transparent">
              Built around your idea.
            </span>
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.65 }}
            className="muted-copy mt-7 max-w-2xl text-base sm:text-lg"
          >
            {siteConfig.description}
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/58 px-4 py-2 text-xs text-[var(--foreground-secondary)] backdrop-blur-lg"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            Built by {siteConfig.founder} · {siteConfig.founderTitle}
          </motion.div>
          <div className="mt-6 flex min-h-8 items-center gap-3 font-mono text-xs tracking-[0.15em] text-[var(--foreground-muted)] uppercase sm:text-sm">
            <span className="text-[var(--accent)]">{"//"}</span>
            <span>Interface to infrastructure</span>
          </div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.6 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="/contact?source=homepage">
              Start a Project
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              View Our Work
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.2, duration: reduced ? 0 : 0.7 }}
          className="relative mx-auto w-full max-w-xl min-w-0"
        >
          <ProductPipeline />
        </motion.div>
      </div>
    </section>
  );
}
