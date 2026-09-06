import Link from "next/link";
import { ArrowUp, BriefcaseBusiness, CodeXml, Mail } from "lucide-react";
import { siteConfig } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="container-shell py-14 sm:py-20">
        <div className="grid gap-10 border-b border-[var(--border)] pb-12 md:grid-cols-[1fr_auto_auto]">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-[-0.05em]"
            >
              NextWeb <span className="text-[var(--accent)]">Studio</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
              {siteConfig.positioning}
              <span className="mt-2 block text-white/55">
                Built by {siteConfig.founder}.
              </span>
            </p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-white/50 uppercase">
              Navigate
            </p>
            <div className="grid gap-3 text-sm">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          {siteConfig.github || siteConfig.linkedin || siteConfig.email ? (
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.16em] text-white/50 uppercase">
                Connect
              </p>
              <div className="flex gap-3">
                {siteConfig.github ? (
                  <Link
                    href={siteConfig.github}
                    aria-label="GitHub"
                    className="grid size-11 place-items-center rounded-full border border-[var(--border)] text-[var(--foreground-secondary)] transition hover:border-[var(--border-hover)] hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CodeXml size={18} />
                  </Link>
                ) : null}
                {siteConfig.linkedin ? (
                  <Link
                    href={siteConfig.linkedin}
                    aria-label="LinkedIn"
                    className="grid size-11 place-items-center rounded-full border border-[var(--border)] text-[var(--foreground-secondary)] transition hover:border-[var(--border-hover)] hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BriefcaseBusiness size={18} />
                  </Link>
                ) : null}
                {siteConfig.email ? (
                  <Link
                    href={`mailto:${siteConfig.email}`}
                    aria-label="Email"
                    className="grid size-11 place-items-center rounded-full border border-[var(--border)] text-[var(--foreground-secondary)] transition hover:border-[var(--border-hover)] hover:text-white"
                  >
                    <Mail size={18} />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <Link
            href="#top"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            Back to top <ArrowUp size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
