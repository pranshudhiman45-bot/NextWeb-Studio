"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Check,
  Globe2,
  ServerCog,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";

const solutions = [
  {
    id: "business-website",
    tab: "Business Website",
    label: "Business website",
    title: "Turn attention into trust and qualified leads.",
    description:
      "High-performance websites designed to build credibility, generate leads, and convert visitors into customers.",
    bestFor: [
      "Small businesses",
      "Agencies",
      "Clinics",
      "Professionals",
      "Service companies",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB or CMS"],
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
      "Scalable web applications for startups and businesses building subscription-based digital products.",
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
    stack: [
      "Next.js",
      "TypeScript",
      "MongoDB / PostgreSQL",
      "Charting libraries",
    ],
    features: [
      "Data visualization",
      "Role-based access",
      "Search and filters",
      "Reports",
      "Export functionality",
      "Real-time updates",
    ],
    integrations: ["Data warehouses", "WebSockets", "PDF / CSV exports"],
    cta: "Build a dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    id: "e-commerce",
    tab: "E-commerce",
    label: "E-commerce",
    title: "Create a storefront built around conversion.",
    description:
      "Modern online stores focused on performance, conversion, and easy management.",
    bestFor: [
      "Brands",
      "Retail businesses",
      "D2C businesses",
      "Product companies",
    ],
    stack: [
      "Next.js",
      "Shopify or custom backend",
      "Tailwind CSS",
      "Payment gateway",
    ],
    features: [
      "Product catalog",
      "Search",
      "Shopping cart",
      "Checkout",
      "Payments",
      "Order management",
    ],
    integrations: ["Shopify", "Stripe / Razorpay", "Shipping providers"],
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
    stack: [
      "Next.js",
      "Python APIs where required",
      "MongoDB",
      "LLM APIs",
      "Vector database",
    ],
    features: [
      "AI chat",
      "RAG",
      "Agent workflows",
      "Document processing",
      "Streaming responses",
      "API integrations",
    ],
    integrations: ["OpenAI", "Vector search", "Cloud storage"],
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
    stack: [
      "Next.js Route Handlers",
      "Node.js",
      "MongoDB / PostgreSQL",
      "REST APIs",
    ],
    features: [
      "Authentication",
      "API endpoints",
      "Database architecture",
      "Validation",
      "Third-party integrations",
      "Logging and error handling",
    ],
    integrations: ["Redis", "Background jobs", "Monitoring"],
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

export function ProductSelector() {
  const [activeId, setActiveId] = useState<SolutionId>(solutions[0].id);
  const reduced = useReducedMotion();
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
            description="Choose the product you’re planning and see how NextWeb Studio can shape its scope, stack, and core experience."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div
            className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="Product type"
          >
            {solutions.map((solution) => (
              <button
                key={solution.id}
                id={`solution-tab-${solution.id}`}
                type="button"
                role="tab"
                aria-selected={activeId === solution.id}
                aria-controls={`solution-panel-${solution.id}`}
                onClick={() => setActiveId(solution.id)}
                className={`relative shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  activeId === solution.id
                    ? "text-white"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                }`}
              >
                {solution.tab}
                {activeId === solution.id ? (
                  <motion.span
                    layoutId="active-solution-tab"
                    className="absolute inset-x-3 bottom-0 h-px bg-[var(--accent)] shadow-[0_0_14px_rgba(200,255,61,0.22)]"
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative mt-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.id}
              id={`solution-panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`solution-tab-${active.id}`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: reduced ? 0.01 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-surface relative overflow-hidden rounded-[28px] p-6 sm:p-8 lg:p-10"
            >
              <div className="pointer-events-none absolute -top-32 -right-28 size-80 rounded-full bg-[var(--accent-soft)] blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-white/[0.035] text-[var(--accent)]">
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
                          className="flex items-center gap-2 text-sm text-white/75"
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
                          className="rounded-full border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70"
                        >
                          {technology}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase">
                      Core features
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
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
