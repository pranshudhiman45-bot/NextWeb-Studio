"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Check, Circle, GitBranch, Terminal } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { ButtonLink } from "@/components/ui/button-link";

const roles = [
  "Full Stack Applications",
  "Business Websites",
  "AI-Powered Products",
  "SaaS Platforms",
  "E-commerce Platforms",
  "Dashboards",
  "APIs & Backend Systems",
];

export function Hero() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(280);
  const pointerY = useMotionValue(220);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 24 });
  const glowX = useSpring(pointerX, { stiffness: 160, damping: 28 });
  const glowY = useSpring(pointerY, { stiffness: 160, damping: 28 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointerX.set(x);
    pointerY.set(y);
    rawRotateX.set((y / bounds.height - 0.5) * -1 * 3.5);
    rawRotateY.set((x / bounds.width - 0.5) * 3.5);
  }

  function resetPointerEffect() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % roles.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <section className="relative flex min-h-[920px] items-center overflow-hidden pt-28 sm:min-h-screen">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" />
      <div className="container-shell relative grid items-center gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-black/35 px-3 py-2 text-xs font-semibold text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl"
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
            We build digital products that{" "}
            <span className="text-[var(--accent)]">perform.</span>
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.65 }}
            className="muted-copy mt-7 max-w-2xl text-base sm:text-lg"
          >
            NextWeb Studio is an independent development studio by Vinay Kumar,
            building modern websites, full-stack applications, SaaS platforms,
            e-commerce experiences and AI-powered products.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs text-white/55 backdrop-blur-lg"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            Built by Vinay Kumar · Full Stack Developer
          </motion.div>
          <div className="mt-6 flex min-h-8 items-center gap-3 font-mono text-xs tracking-[0.15em] text-white/50 uppercase sm:text-sm">
            <span className="text-[var(--accent)]">{"//"}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[active]}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {roles[active]}
              </motion.span>
            </AnimatePresence>
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
              Explore the Work
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <motion.div
            className="group glass-surface relative overflow-hidden rounded-3xl"
            style={{
              rotateX: reduced ? 0 : rotateX,
              rotateY: reduced ? 0 : rotateY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointerEffect}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/2 bg-gradient-to-b from-white/[0.035] to-transparent" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 z-0 size-64 rounded-full bg-[var(--accent)]/[0.055] blur-3xl" />
            <motion.div
              aria-hidden="true"
              className="hero-spotlight pointer-events-none absolute z-0 hidden size-64 rounded-full bg-[radial-gradient(circle,rgba(200,255,61,0.10),transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ x: glowX, y: glowY, marginLeft: -128, marginTop: -128 }}
            />
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex gap-2">
                <Circle size={9} fill="#ff6b6b" color="#ff6b6b" />
                <Circle size={9} fill="#ffd66b" color="#ffd66b" />
                <Circle size={9} fill="#8edb75" color="#8edb75" />
              </div>
              <span className="font-mono text-[10px] text-white/35">
                nextweb-system.ts
              </span>
              <GitBranch size={14} className="text-white/35" />
            </div>
            <div className="relative z-10 grid gap-5 p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40">Studio capability</p>
                  <p className="mt-1 text-lg font-bold">
                    Interface to infrastructure
                  </p>
                </div>
                <div className="rounded-full bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
                  <Check size={18} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Web", "Interfaces"],
                  ["API", "Systems"],
                  ["AI", "Integrations"],
                ].map(([value, label]) => (
                  <motion.div
                    key={label}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-md transition-colors hover:border-white/[0.16] hover:bg-white/[0.05]"
                    whileHover={reduced ? undefined : { y: -2 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <p className="text-xl font-bold text-[var(--accent)]">
                      {value}
                    </p>
                    <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-5 font-mono text-xs leading-7 text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-lg">
                <p>
                  <span className="text-purple-300">const</span> product ={" "}
                  <span className="text-sky-300">await</span> build&#40;&#123;
                </p>
                <p className="pl-5">
                  strategy:{" "}
                  <span className="text-amber-200">&quot;clear&quot;</span>,
                </p>
                <p className="pl-5">
                  experience:{" "}
                  <span className="text-amber-200">&quot;polished&quot;</span>,
                </p>
                <p className="pl-5">
                  engineering:{" "}
                  <span className="text-amber-200">&quot;resilient&quot;</span>
                </p>
                <p>&#125;&#41;;</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <Terminal size={15} className="text-[var(--accent)]" /> Built
                for real-world use
              </div>
            </div>
          </motion.div>
          <div className="absolute -bottom-7 -left-7 -z-10 size-36 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
