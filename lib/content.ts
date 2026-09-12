import {
  Bot,
  Braces,
  ChartNoAxesCombined,
  Gauge,
  Globe2,
  Layers3,
  LifeBuoy,
  ServerCog,
  ShoppingBag,
} from "lucide-react";

export const solutions = [
  {
    title: "Business Websites",
    description:
      "Distinct, high-performing websites built to turn attention into action.",
    icon: Globe2,
  },
  {
    title: "Full Stack Web Applications",
    description:
      "Robust products with polished interfaces and dependable systems behind them.",
    icon: Layers3,
  },
  {
    title: "SaaS Platforms",
    description:
      "Multi-tenant software foundations designed for iteration, scale, and recurring value.",
    icon: Braces,
  },
  {
    title: "Dashboards",
    description:
      "Complex operations and data translated into clear, useful decision-making tools.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "API & Backend Development",
    description:
      "Secure, well-structured APIs and services that remain easy to evolve.",
    icon: ServerCog,
  },
  {
    title: "AI-Powered Applications",
    description:
      "Practical AI features grounded in real workflows, evidence, and measurable utility.",
    icon: Bot,
  },
  {
    title: "E-commerce Experiences",
    description:
      "Fast, intuitive shopping journeys paired with reliable commerce operations.",
    icon: ShoppingBag,
  },
];

export const services = [
  {
    id: "website-development",
    title: "Custom Website Development",
    shortTitle: "Website Development",
    description:
      "Responsive websites for businesses and professionals who need to explain their services, present their work, and receive inquiries.",
    useCases:
      "Company sites, product launches, service businesses, editorial platforms",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "UX direction",
      "Responsive build",
      "Content structure",
      "SEO foundation",
    ],
    icon: Globe2,
  },
  {
    id: "full-stack-applications",
    title: "Full Stack Web Applications",
    shortTitle: "Full Stack Applications",
    description:
      "Connected interfaces, APIs, and databases for businesses building customer portals, internal tools, or web applications.",
    useCases:
      "Customer portals, internal tools, marketplaces, workflow products",
    technologies: ["Next.js", "Node.js", "Express", "MongoDB"],
    deliverables: [
      "Product architecture",
      "Frontend and backend",
      "Database design",
      "Deployment",
    ],
    icon: Layers3,
  },
  {
    id: "saas-development",
    title: "SaaS Development",
    shortTitle: "SaaS Development",
    description:
      "Subscription product development for founders who need a focused first release, account workflows, and a plan for future features.",
    useCases:
      "B2B platforms, subscription products, team workspaces, vertical SaaS",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    deliverables: [
      "MVP scope",
      "Account and access model",
      "Billing workflows",
      "Admin systems",
    ],
    icon: Braces,
  },
  {
    id: "e-commerce",
    title: "E-commerce Development",
    shortTitle: "E-commerce",
    description:
      "Storefronts that connect clear product discovery with dependable cart, checkout, payment, and administration workflows.",
    useCases:
      "Retail storefronts, direct-to-consumer products, catalogs, ordering platforms",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    deliverables: [
      "Storefront experience",
      "Catalog and cart",
      "Checkout integration",
      "Admin workflows",
    ],
    icon: ShoppingBag,
  },
  {
    id: "dashboards",
    title: "Dashboard Development",
    shortTitle: "Dashboards",
    description:
      "Focused operational interfaces that make data, workflows, permissions, and system state easier to manage.",
    useCases:
      "Admin platforms, internal tools, reporting interfaces, operations systems",
    technologies: ["React", "TypeScript", "REST APIs", "MongoDB"],
    deliverables: [
      "Information architecture",
      "Responsive interface",
      "Role-aware workflows",
      "API integration",
    ],
    icon: ChartNoAxesCombined,
  },
  {
    id: "backend-api",
    title: "Backend & API Development",
    shortTitle: "Backend & APIs",
    description:
      "APIs and server-side workflows for teams connecting an existing frontend, a database, or an external service.",
    useCases: "REST APIs, integrations, background jobs, data services",
    technologies: ["Node.js", "Express", "Next.js server-side APIs", "MongoDB"],
    deliverables: [
      "API design",
      "Service implementation",
      "Documentation",
      "Validation and error handling",
    ],
    icon: ServerCog,
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    shortTitle: "AI Integrations",
    description:
      "Language-model integrations for businesses adding prompt assistance, content processing, or conversational features to an application.",
    useCases:
      "Prompt enhancement, content workflows, conversational interfaces",
    technologies: ["Node.js", "Next.js", "LLM APIs"],
    deliverables: [
      "Use-case design",
      "AI workflow",
      "Evaluation approach",
      "Product integration",
    ],
    icon: Bot,
  },
  {
    id: "performance-optimization",
    title: "Website Performance Optimization",
    shortTitle: "Performance Optimization",
    description:
      "Targeted improvements that make existing experiences faster, clearer, and more reliable.",
    useCases:
      "Core Web Vitals, slow storefronts, technical SEO, frontend audits",
    technologies: ["Lighthouse", "Next.js", "Web Vitals", "Analytics"],
    deliverables: [
      "Performance audit",
      "Prioritized fixes",
      "Implementation",
      "Before/after report",
    ],
    icon: Gauge,
  },
  {
    id: "maintenance-support",
    title: "Maintenance & Support",
    shortTitle: "Maintenance & Support",
    description:
      "Bug fixes, dependency updates, and small feature releases for businesses maintaining an existing website or application.",
    useCases:
      "Feature releases, bug fixes, dependency upgrades, production support",
    technologies: ["Git", "GitHub", "Vercel", "Render"],
    deliverables: [
      "Agreed release schedule",
      "Application checks",
      "Issue response",
      "Technical guidance",
    ],
    icon: LifeBuoy,
  },
];

export const technologies = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "Next.js server-side APIs", "REST APIs"],
  Database: ["MongoDB", "Mongoose"],
  Other: ["Git", "GitHub", "Vercel", "Render", "LLM API integrations"],
};
