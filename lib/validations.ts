import { z } from "zod";
import { phoneSchema } from "@/lib/phone";

export const projectTypes = [
  "Website",
  "Full Stack Web App",
  "SaaS",
  "Dashboard",
  "API / Backend",
  "AI Application",
  "E-commerce",
  "Performance Optimization",
  "Maintenance & Support",
  "Other",
] as const;

export type ProjectType = (typeof projectTypes)[number];

const projectTypeByQuery: Record<string, ProjectType> = {
  "business-website": "Website",
  "saas-product": "SaaS",
  dashboard: "Dashboard",
  "e-commerce": "E-commerce",
  "ai-application": "AI Application",
  "api-backend": "API / Backend",
};

export function getProjectTypeFromQuery(value?: string) {
  return value &&
    Object.prototype.hasOwnProperty.call(projectTypeByQuery, value)
    ? projectTypeByQuery[value]
    : undefined;
}

export const budgets = [
  "Under ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Not sure yet",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  phone: phoneSchema,
  company: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.enum(projectTypes, { error: "Choose a project type" }),
  budget: z.enum(budgets, { error: "Choose an estimated budget" }),
  timeline: z.string().trim().min(2, "Tell me your ideal timeline").max(80),
  message: z
    .string()
    .trim()
    .min(20, "Please share at least 20 characters about your project")
    .max(3000),
  source: z.string().trim().max(80).optional(),
  website: z.string().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
