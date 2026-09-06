export const projectCategories = [
  "Full Stack",
  "Frontend",
  "Backend",
  "AI",
  "Showcase",
  "Open Source",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const projectTypes = [
  "NextWeb Studio Project",
  "Personal Project",
  "Showcase Application",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export interface ProjectDetailSection {
  title: string;
  description: string;
  items?: string[];
}

export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  projectType: ProjectType;
  primaryCategory: ProjectCategory;
  categories: ProjectCategory[];
  technologies: string[];
  thumbnail: string;
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  internalUrl?: string;
  featured: boolean;
  problem: string;
  solution: string;
  architecture: string;
  architectureHeading?: string;
  challenges?: string[];
  challengesHeading?: string;
  implementation: string;
  implementationHeading?: string;
  results: string[];
  resultsEyebrow?: string;
  resultsTitle?: string;
  technologyNote?: string;
  details?: ProjectDetailSection[];
}

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  source?: string;
}
