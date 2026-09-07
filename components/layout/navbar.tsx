"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn, siteConfig } from "@/lib/utils";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Work", "/projects"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(
    () => scrollY.on("change", (value) => setScrolled(value > 24)),
    [scrollY],
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 py-0 transition-all duration-300">
      <nav
        className={cn(
          "container-shell pointer-events-auto flex h-20 items-center justify-between border border-transparent px-0 transition-all duration-300",
          scrolled || open
            ? "mt-3 h-16 rounded-full border-[var(--border)] bg-[#020b18]/82 px-4 shadow-[0_14px_46px_rgba(0,8,24,0.48),0_0_34px_rgba(0,126,255,0.045)] backdrop-blur-xl sm:px-5"
            : "mt-0",
        )}
        aria-label="Primary navigation"
      >
        <BrandLogo className="relative z-50" />
        <span className="sr-only">Built by {siteConfig.founder}</span>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative py-2 text-sm font-semibold transition-colors hover:text-white",
                  active ? "text-white" : "text-[var(--muted)]",
                )}
              >
                {label}
                {active ? (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--accent)]"
                  />
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="rounded-full border border-blue-200/15 bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,126,255,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[0_10px_30px_rgba(0,158,255,0.24)]"
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          className="relative z-50 grid size-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/70 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            className="container-shell pointer-events-auto mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#020b18]/92 shadow-[0_18px_50px_rgba(0,8,24,0.5)] backdrop-blur-2xl lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1 px-3 py-5">
              {links.map(([label, href], index) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-lg font-semibold",
                      pathname === href
                        ? "bg-white/5 text-[var(--accent)]"
                        : "text-white",
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
