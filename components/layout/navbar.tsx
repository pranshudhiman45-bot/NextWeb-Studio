"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import motionStyles from "@/components/animations/studio-motion.module.css";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
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
  const reduced = useReducedMotionPreference();
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(
    () => scrollY.on("change", (value) => setScrolled(value > 24)),
    [scrollY],
  );

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 py-0 transition-all duration-300"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}
    >
      <nav
        className={cn(
          "container-shell pointer-events-auto flex h-20 items-center justify-between border border-transparent px-0 transition-all duration-300",
          scrolled || open
            ? "mt-3 h-16 rounded-full border-[var(--border)] bg-[var(--nav-background)] px-4 shadow-[var(--nav-shadow)] backdrop-blur-xl sm:px-5"
            : "mt-0 bg-[var(--nav-idle)] backdrop-blur-[2px]",
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
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm font-semibold transition-colors hover:text-[var(--foreground)]",
                  active ? "text-[var(--foreground)]" : "text-[var(--muted)]",
                )}
              >
                {label}
                {active ? (
                  <motion.span
                    layoutId="active-nav"
                    transition={{
                      duration: reduced ? 0 : 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--accent)]"
                  />
                ) : null}
              </Link>
            );
          })}
          <ThemeSwitcher />
          <Link
            href="/contact"
            className={`${motionStyles.sweep} rounded-full border border-blue-200/15 bg-[var(--button-primary)] px-5 py-3 text-sm font-bold text-[var(--accent-ink)] shadow-[0_8px_24px_rgba(0,126,255,0.16)] transition-all hover:bg-[var(--button-hover)] hover:shadow-[0_10px_30px_rgba(0,158,255,0.24)] motion-safe:hover:-translate-y-0.5`}
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          ref={menuButton}
          className="relative z-50 grid size-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--foreground)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={
                reduced ? false : { opacity: 0, rotate: -15, scale: 0.9 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{
                opacity: 0,
                rotate: reduced ? 0 : 15,
                scale: reduced ? 1 : 0.9,
              }}
              transition={{ duration: reduced ? 0 : 0.15 }}
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
            className="container-shell pointer-events-auto mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--nav-background)] shadow-[var(--nav-shadow)] backdrop-blur-2xl lg:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduced ? 0 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-col gap-1 px-3 py-5">
              <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] px-3 pb-4">
                <span className="text-sm font-semibold text-[var(--foreground-secondary)]">
                  Appearance
                </span>
                <ThemeSwitcher />
              </div>
              {links.map(([label, href], index) => (
                <motion.div
                  key={href}
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.2,
                    delay: reduced ? 0 : index * 0.03,
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-lg font-semibold",
                      pathname === href
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--foreground)]",
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
