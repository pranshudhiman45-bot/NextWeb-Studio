import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AmbientMotion } from "@/components/animations/ambient-motion";
import motionStyles from "@/components/animations/studio-motion.module.css";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const focusStyles =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10d9f5]";

const linkStyles =
  "inline-flex min-h-11 items-center text-sm leading-6 text-[#a7b8cd] hover:text-white motion-safe:transition-[color,transform] motion-safe:duration-200 motion-safe:hover:translate-x-1";

const projectInquiryUrl = "/contact?source=cta";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <nav aria-label={`Footer ${title.toLowerCase()}`}>
      <h3 className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-white uppercase">
        {title}
      </h3>
      <ul>
        {links.map(({ label, href, external }) => (
          <li key={label}>
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={`${linkStyles} ${focusStyles} ${title === "Connect" ? "hover:text-[#74c9ff]" : ""}`}
            >
              {label}
              {external ? (
                <span className="sr-only"> (opens in a new tab)</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const calendarUrl = siteConfig.calendar?.trim();
  const githubUrl = siteConfig.github?.trim();
  const linkedinUrl = siteConfig.linkedin?.trim();
  const email = siteConfig.email?.trim();
  const connectLinks: FooterLink[] = [
    ...(githubUrl
      ? [{ label: "GitHub", href: githubUrl, external: true }]
      : []),
    ...(linkedinUrl
      ? [{ label: "LinkedIn", href: linkedinUrl, external: true }]
      : []),
    ...(email ? [{ label: "Email", href: `mailto:${email}` }] : []),
    ...(calendarUrl
      ? [{ label: "Book a Call", href: calendarUrl, external: true }]
      : []),
  ];
  const workLinks: FooterLink[] = [
    { label: "Projects", href: "/projects" },
    ...projects
      .filter(({ slug }) => slug === "ryora" || slug === "e-commerce")
      .map(({ slug, title }) => ({
        label: title,
        href: `/projects/${slug}`,
      })),
  ];

  return (
    <footer className="studio-footer relative isolate overflow-hidden border-t border-[rgba(46,144,255,0.15)] bg-[#020914] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[32rem] w-full max-w-3xl bg-[radial-gradient(ellipse_at_75%_0%,rgba(8,124,255,0.10),transparent_65%)]"
      />
      <AmbientMotion variant="connections" />
      <div className="container-shell">
        <section
          aria-labelledby="footer-cta-heading"
          className="grid gap-8 border-b border-[rgba(46,144,255,0.15)] py-14 sm:gap-10 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16 lg:py-24"
        >
          <div>
            <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-[#a7b8cd] sm:mb-8">
              <span aria-hidden="true" className="h-px w-7 bg-[#10d9f5]/70" />
              NEXTWEB STUDIO
            </p>
            <h2
              id="footer-cta-heading"
              className="max-w-2xl text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-white"
            >
              Build something
              <br />
              worth shipping.
            </h2>
          </div>
          <div className="max-w-md lg:justify-self-end lg:pb-1">
            <p className="text-base leading-7 text-[#a7b8cd]">
              Share what you want to build, who will use it, and what you need
              from the first version. {siteConfig.founder} will help you define
              the next step.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={projectInquiryUrl}
                className={`${motionStyles.sweep} group inline-flex min-h-[52px] items-center justify-center gap-5 rounded-xl border border-blue-300/15 bg-[#0870ed] px-6 text-sm font-semibold text-white hover:bg-[#0864d6] motion-safe:transition-[background-color,transform] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 ${focusStyles}`}
              >
                Start a Project
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
                />
              </Link>
              {calendarUrl ? (
                <Link
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex min-h-[52px] items-center justify-center gap-5 rounded-xl border border-[rgba(46,144,255,0.24)] bg-[#071426]/50 px-6 text-sm font-semibold text-white hover:border-[#2e90ff]/50 hover:bg-[#0b1d33] motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 ${focusStyles}`}
                >
                  Book a Call
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <BrandLogo className={`min-h-11 rounded-sm ${focusStyles}`} />
            <p className="mt-5 text-sm leading-7 text-[#a7b8cd]">
              Built and owned by {siteConfig.founder}
              <span className="block text-[#8193a8]">Full Stack Developer</span>
            </p>
          </div>
          <div
            className={`grid min-w-0 gap-x-8 gap-y-9 sm:grid-cols-2 ${connectLinks.length ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            <FooterColumn
              title="Services"
              links={[
                {
                  label: "Web Development",
                  href: "/services#website-development",
                },
                {
                  label: "Full Stack Development",
                  href: "/services#full-stack-applications",
                },
                { label: "E-commerce", href: "/services#e-commerce" },
                { label: "AI Integration", href: "/services#ai-integration" },
                { label: "Backend & APIs", href: "/services#backend-api" },
              ]}
            />
            <FooterColumn title="Work" links={workLinks} />
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Contact", href: "/contact" },
                { label: "Start a Project", href: projectInquiryUrl },
              ]}
            />
            {connectLinks.length ? (
              <FooterColumn title="Connect" links={connectLinks} />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-[rgba(46,144,255,0.15)] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-xs leading-6 text-[#8193a8]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="#top"
            className={`group inline-flex min-h-11 shrink-0 items-center gap-3 rounded-sm text-xs font-medium text-[#a7b8cd] hover:text-white motion-safe:transition-colors motion-safe:duration-200 ${focusStyles}`}
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-[rgba(46,144,255,0.2)] bg-[#071426]/60 group-hover:border-[#2e90ff]/50 motion-safe:transition-colors motion-safe:duration-200">
              <ArrowUp
                aria-hidden="true"
                size={14}
                className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
