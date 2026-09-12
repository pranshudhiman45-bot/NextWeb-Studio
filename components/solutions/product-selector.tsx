"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import {
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Check,
  Globe2,
  ServerCog,
  ShoppingBag,
} from "lucide-react";
import { forwardRef, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";

const solutions = [
  {
    id: "business-website",
    tab: "Business Website",
    label: "Business website",
    title: "Make your business easy to understand and contact.",
    description:
      "Responsive websites for presenting services, answering customer questions, and receiving inquiries.",
    bestFor: [
      "Small businesses",
      "Agencies",
      "Clinics",
      "Professionals",
      "Service companies",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB when needed"],
    features: [
      "Responsive design",
      "Contact forms",
      "SEO",
      "Analytics",
      "CMS",
      "Booking integration",
    ],
    integrations: ["Headless CMS", "Cal.com", "Google Analytics"],
    cta: "Start a website project",
    icon: Globe2,
  },
  {
    id: "saas-product",
    tab: "SaaS Product",
    label: "SaaS product",
    title: "Build a focused product ready for real customers.",
    description:
      "Web applications for founders building a subscription product, starting with a focused set of account and product workflows.",
    bestFor: ["Startups", "SaaS companies", "Internal products"],
    stack: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Authentication",
      "Payment integration",
    ],
    features: [
      "Authentication",
      "Dashboard",
      "User roles",
      "Subscription billing",
      "Admin panel",
      "API integrations",
    ],
    integrations: ["Stripe", "Transactional email", "Product analytics"],
    cta: "Build a SaaS product",
    icon: Boxes,
  },
  {
    id: "dashboard",
    tab: "Dashboard",
    label: "Dashboard",
    title: "Make complex information easier to act on.",
    description:
      "Data-rich dashboards and internal tools designed to make complex information easier to understand and manage.",
    bestFor: [
      "Internal business tools",
      "Analytics products",
      "Admin platforms",
      "Operations systems",
    ],
    stack: ["Next.js", "TypeScript", "MongoDB", "Charting libraries"],
    features: [
      "Data visualization",
      "Role-based access",
      "Search and filters",
      "Reports",
      "Export functionality",
      "Real-time updates",
    ],
    integrations: ["Existing REST APIs", "WebSockets", "CSV exports"],
    cta: "Build a dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    id: "e-commerce",
    tab: "E-commerce",
    label: "E-commerce",
    title: "Connect your catalog, cart, and checkout.",
    description:
      "Online stores for retailers who need product discovery, ordering, payments, and catalog management.",
    bestFor: [
      "Brands",
      "Retail businesses",
      "D2C businesses",
      "Product companies",
    ],
    stack: ["Next.js", "Node.js / Express", "Tailwind CSS", "MongoDB"],
    features: [
      "Product catalog",
      "Search",
      "Shopping cart",
      "Checkout",
      "Payments",
      "Order management",
    ],
    integrations: [
      "Stripe",
      "Transactional email",
      "Delivery services (subject to scope)",
    ],
    cta: "Build an online store",
    icon: ShoppingBag,
  },
  {
    id: "ai-application",
    tab: "AI Application",
    label: "AI application",
    title: "Apply AI where it creates practical value.",
    description:
      "AI-powered products combining modern web interfaces with intelligent automation and language models.",
    bestFor: [
      "AI startups",
      "Automation tools",
      "Internal AI systems",
      "Research tools",
    ],
    stack: ["Next.js", "Node.js APIs", "MongoDB", "LLM APIs", "TypeScript"],
    features: [
      "AI chat",
      "Prompt assistance",
      "Human review",
      "Document processing",
      "Streaming responses",
      "API integrations",
    ],
    integrations: [
      "LLM provider",
      "Document search (subject to scope)",
      "Cloud storage",
    ],
    cta: "Discuss an AI project",
    icon: Bot,
  },
  {
    id: "api-backend",
    tab: "API / Backend",
    label: "API and backend",
    title: "Build dependable systems behind the interface.",
    description:
      "Reliable backend systems and APIs that power applications, integrations, and business workflows.",
    bestFor: [
      "Mobile apps",
      "Existing frontend applications",
      "Platform integrations",
      "Automation systems",
    ],
    stack: ["Next.js Route Handlers", "Node.js", "MongoDB", "REST APIs"],
    features: [
      "Authentication",
      "API endpoints",
      "Database architecture",
      "Validation",
      "Third-party integrations",
      "Logging and error handling",
    ],
    integrations: ["Transactional email", "Payment APIs", "Monitoring"],
    cta: "Build my backend",
    icon: ServerCog,
  },
] as const;

type SolutionId = (typeof solutions)[number]["id"];

const stagger = {
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 7 },
  show: { opacity: 1, y: 0 },
};

const SolutionPanelContent = forwardRef<
  HTMLDivElement,
  { children: ReactNode; reduced: boolean }
>(function SolutionPanelContent({ children, reduced }, ref) {
  const present = useIsPresent();
  return (
    <motion.div
      ref={ref}
      inert={!present}
      aria-hidden={!present}
      layout={reduced ? false : "position"}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -4 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14"
    >
      {children}
    </motion.div>
  );
});

export function ProductSelector() {
  const [activeId, setActiveId] = useState<SolutionId>(solutions[0].id);
  const reduced = useReducedMotionPreference();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active =
    solutions.find((solution) => solution.id === activeId) ?? solutions[0];
  const Icon = active.icon;

  return (
    <section className="section-pad overflow-hidden">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Solutions"
            title="What are you looking to build?"
            description="Choose a starting point for your brief. These are scope options; the final features and integrations are agreed before development."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div
            className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="Product type"
          >
            {solutions.map((solution, index) => (
              <button
                key={solution.id}
                id={`solution-tab-${solution.id}`}
                type="button"
                role="tab"
                aria-selected={activeId === solution.id}
                aria-controls="solution-panel"
                tabIndex={activeId === solution.id ? 0 : -1}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                onClick={() => setActiveId(solution.id)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % solutions.length
                      : event.key === "ArrowLeft"
                        ? (index - 1 + solutions.length) % solutions.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? solutions.length - 1
                            : undefined;
                  if (next === undefined) return;
                  event.preventDefault();
                  setActiveId(solutions[next].id);
                  tabRefs.current[next]?.focus();
                }}
                className={`relative shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  activeId === solution.id
                    ? "bg-[var(--tab-active-background)] text-[var(--cyan)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                }`}
              >
                {solution.tab}
                {activeId === solution.id ? (
                  <motion.span
                    layoutId="active-solution-tab"
                    className="absolute inset-x-3 bottom-0 h-px bg-[var(--accent)] shadow-[0_0_14px_rgba(16,217,245,0.22)]"
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.article
          layout={reduced ? false : "size"}
          id="solution-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`solution-tab-${active.id}`}
          transition={{
            duration: reduced ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="glass-surface relative mt-5 overflow-hidden rounded-[28px] p-6 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -top-32 -right-28 size-80 rounded-full bg-[var(--accent-soft)] blur-3xl" />
          <AnimatePresence mode="popLayout" initial={false}>
            <SolutionPanelContent key={active.id} reduced={reduced}>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/65 text-[var(--cyan)]">
                    <Icon size={19} />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
                    {active.label}
                  </span>
                </div>
                <h3 className="mt-7 max-w-xl text-3xl font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                  {active.description}
                </p>
                <div className="mt-7">
                  <p className="text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase">
                    Best for
                  </p>
                  <motion.ul
                    variants={reduced ? undefined : stagger}
                    initial={reduced ? undefined : "hidden"}
                    animate={reduced ? undefined : "show"}
                    className="mt-4 flex flex-wrap gap-x-5 gap-y-3"
                  >
                    {active.bestFor.map((entry) => (
                      <motion.li
                        key={entry}
                        variants={reduced ? undefined : item}
                        className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]"
                      >
                        <Check size={14} className="text-[var(--accent)]" />
                        {entry}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <ButtonLink
                  href={`/contact?project=${active.id}&source=solution-selector`}
                  className="mt-8 self-start"
                >
                  {active.cta}
                </ButtonLink>
              </div>

              <div className="grid gap-6 border-t border-[var(--border)] pt-8 sm:grid-cols-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase">
                    Recommended stack
                  </p>
                  <motion.div
                    variants={reduced ? undefined : stagger}
                    initial={reduced ? undefined : "hidden"}
                    animate={reduced ? undefined : "show"}
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {active.stack.map((technology) => (
                      <motion.span
                        variants={reduced ? undefined : item}
                        key={technology}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/52 px-3 py-1.5 text-xs text-[var(--foreground-secondary)]"
                      >
                        {technology}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase">
                    Possible features
                  </p>
                  <motion.ul
                    variants={reduced ? undefined : stagger}
                    initial={reduced ? undefined : "hidden"}
                    animate={reduced ? undefined : "show"}
                    className="mt-4 grid gap-3"
                  >
                    {active.features.map((feature) => (
                      <motion.li
                        variants={reduced ? undefined : item}
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-[var(--foreground-secondary)]"
                      >
                        <span className="size-1 rounded-full bg-[var(--accent)]" />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase">
                    Optional integrations
                  </p>
                  <motion.ul
                    variants={reduced ? undefined : stagger}
                    initial={reduced ? undefined : "hidden"}
                    animate={reduced ? undefined : "show"}
                    className="mt-4 grid gap-3"
                  >
                    {active.integrations.map((integration) => (
                      <motion.li
                        variants={reduced ? undefined : item}
                        key={integration}
                        className="text-sm text-[var(--foreground-secondary)]"
                      >
                        {integration}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </SolutionPanelContent>
          </AnimatePresence>
        </motion.article>
      </div>
    </section>
  );
}
