"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitFork } from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      className="group glass-card glass-card-hover overflow-hidden rounded-2xl"
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-[var(--surface-elevated)]"
      >
        <Image
          src={project.thumbnail}
          alt={`${project.title} interface preview`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] uppercase backdrop-blur">
          {project.primaryCategory}
        </span>
      </Link>
      <div className="p-6 sm:p-7">
        <p className="mb-3 font-mono text-[10px] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          {project.projectType}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`View ${project.title} case study`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--border)] transition group-hover:border-[var(--accent)]/55 group-hover:text-[var(--accent)]"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          {project.shortDescription}
        </p>
        {project.technologies.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full bg-white/[0.045] px-3 py-1.5 text-[10px] font-semibold text-white/60"
              >
                {technology}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-[var(--border)] pt-5 text-xs font-bold tracking-[0.1em] text-white/55 uppercase">
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)]"
            >
              Live site
            </Link>
          ) : null}
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
            >
              <GitFork size={13} /> GitHub
            </Link>
          ) : null}
          {project.internalUrl ? (
            <Link
              href={project.internalUrl}
              className="hover:text-[var(--accent)]"
            >
              Showcase
            </Link>
          ) : null}
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-[var(--accent)]"
          >
            View case study
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
