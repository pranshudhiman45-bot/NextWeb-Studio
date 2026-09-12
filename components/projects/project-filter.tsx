"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project, ProjectCategory } from "@/types";

export function ProjectFilter({
  projects,
  searchable = false,
}: {
  projects: Project[];
  searchable?: boolean;
}) {
  const [category, setCategory] = useState<ProjectCategory | "All">("All");
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const availableCategories = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.categories))),
    [projects],
  );
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === "All" || project.categories.includes(category)) &&
          `${project.title} ${project.projectType} ${project.shortDescription} ${project.categories.join(" ")} ${project.technologies.join(" ")}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [category, projects, query],
  );
  const filters: Array<ProjectCategory | "All"> = [
    "All",
    ...availableCategories,
  ];

  return (
    <div>
      <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex max-w-full gap-2 overflow-x-auto pb-2"
          role="group"
          aria-label="Project categories"
        >
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`relative isolate shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-[var(--accent)] bg-[var(--button-primary)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]"}`}
            >
              {category === item ? (
                <motion.span
                  layoutId="active-project-filter"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--button-primary)]"
                />
              ) : null}
              {item}
            </button>
          ))}
        </div>
        {searchable ? (
          <label className="flex min-w-64 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/72 px-4 transition-colors focus-within:border-[var(--border-hover)] focus-within:shadow-[0_0_24px_rgba(0,126,255,0.07)]">
            <Search size={15} className="text-[var(--foreground-muted)]" />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              className="h-11 w-full bg-transparent text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none"
            />
          </label>
        ) : null}
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-[var(--border)] py-16 text-center text-[var(--muted)]">
          No projects match that search yet.
        </p>
      ) : null}
    </div>
  );
}
