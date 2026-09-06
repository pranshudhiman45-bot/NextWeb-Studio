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
    title: "Custom Website Development",
    shortTitle: "Website Development",
    description:
      "Premium marketing and business websites engineered for trust, speed, and conversion.",
    useCases:
      "Company sites, product launches, service businesses, editorial platforms",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "UX direction",
      "Responsive build",
      "CMS integration",
      "SEO foundation",
    ],
    icon: Globe2,
  },
  {
    title: "Full Stack Web Applications",
    shortTitle: "Full Stack Applications",
    description:
      "End-to-end product development from interface architecture to resilient business logic.",
    useCases:
      "Customer portals, internal tools, marketplaces, workflow products",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "MongoDB"],
    deliverables: [
      "Product architecture",
      "Frontend and backend",
      "Database design",
      "Deployment",
    ],
    icon: Layers3,
  },
  {
    title: "SaaS Development",
    shortTitle: "SaaS Development",
    description:
      "Focused SaaS MVPs and foundations that support real customers, teams, and billing.",
    useCases:
      "B2B platforms, subscription products, team workspaces, vertical SaaS",
    technologies: ["Next.js", "PostgreSQL", "Stripe", "Docker"],
    deliverables: [
      "MVP scope",
      "Multi-tenant core",
      "Billing workflows",
      "Admin systems",
    ],
    icon: Braces,
  },
  {
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
    title: "Backend & API Development",
    shortTitle: "Backend & APIs",
    description:
      "Typed, observable backend services that connect products, data, and external systems.",
    useCases: "REST APIs, integrations, background jobs, data services",
    technologies: ["Node.js", "FastAPI", "Redis", "Docker"],
    deliverables: [
      "API design",
      "Service implementation",
      "Documentation",
      "Monitoring hooks",
    ],
    icon: ServerCog,
  },
  {
    title: "AI Integration",
    shortTitle: "AI Integrations",
    description:
      "Useful AI capabilities designed around human workflows, quality controls, and cost.",
    useCases:
      "Knowledge search, content workflows, copilots, intelligent automation",
    technologies: ["Python", "FastAPI", "OpenAI", "Vector search"],
    deliverables: [
      "Use-case design",
      "AI workflow",
      "Evaluation approach",
      "Product integration",
    ],
    icon: Bot,
  },
  {
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
    title: "Maintenance & Support",
    shortTitle: "Maintenance & Support",
    description:
      "Ongoing product care for teams that need dependable iteration without a full-time hire.",
    useCases:
      "Feature releases, bug fixes, dependency upgrades, production support",
    technologies: ["GitHub", "Monitoring", "CI/CD", "Cloud platforms"],
    deliverables: [
      "Regular releases",
      "Health checks",
      "Issue response",
      "Technical guidance",
    ],
    icon: LifeBuoy,
  },
];

export const technologies = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "Python", "Django", "FastAPI"],
  Database: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
  Other: ["Docker", "Git", "GitHub", "REST APIs", "AI integrations"],
};
