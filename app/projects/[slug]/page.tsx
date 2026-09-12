import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  GitFork,
} from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project
    ? pageMetadata(
        project.title,
        project.shortDescription,
        `/projects/${project.slug}`,
      )
    : {};
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <PageTransition>
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-24">
        <div className="container-shell">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.13em] text-[var(--foreground-muted)] uppercase hover:text-[var(--foreground)]"
            >
              <ArrowLeft size={14} /> All projects
            </Link>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">{project.primaryCategory}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {project.projectType}
                  </span>
                </div>
                <h1 className="display-title mt-6">{project.title}</h1>
                <p className="muted-copy mt-7 max-w-2xl text-lg">
                  {project.fullDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {project.internalUrl ? (
                  <ButtonLink href={project.internalUrl} variant="secondary">
                    Open showcase
                  </ButtonLink>
                ) : null}
                {project.liveUrl ? (
                  <ButtonLink href={project.liveUrl} external>
                    Live site <ExternalLink size={15} />
                  </ButtonLink>
                ) : null}
                {project.githubUrl ? (
                  <ButtonLink
                    href={project.githubUrl}
                    external
                    variant="secondary"
                  >
                    GitHub <GitFork size={15} />
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="container-shell">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)]">
            <Image
              src={project.thumbnail}
              alt={`${project.title} project preview`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </Reveal>
      </section>
      <section className="section-pad">
        <div className="container-shell grid gap-14 lg:grid-cols-[0.6fr_1.4fr]">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="text-xs font-bold tracking-[0.15em] text-[var(--foreground-muted)] uppercase">
                Categories
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--foreground-secondary)]"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-xs font-bold tracking-[0.15em] text-[var(--foreground-muted)] uppercase">
                Technology
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--foreground-secondary)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {project.technologyNote ? (
                <p className="mt-4 max-w-xs text-xs leading-6 text-[var(--foreground-muted)]">
                  {project.technologyNote}
                </p>
              ) : null}
            </div>
          </Reveal>
          <div className="space-y-14">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight">The problem</h2>
              <p className="muted-copy mt-5 text-lg">{project.problem}</p>
            </Reveal>
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight">
                The solution
              </h2>
              <p className="muted-copy mt-5 text-lg">{project.solution}</p>
            </Reveal>
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight">
                {project.architectureHeading ?? "Architecture"}
              </h2>
              <p className="muted-copy mt-5 text-lg">{project.architecture}</p>
            </Reveal>
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight">
                {project.implementationHeading ?? "Implementation"}
              </h2>
              <p className="muted-copy mt-5 text-lg">
                {project.implementation}
              </p>
            </Reveal>
            {project.details?.map((detail) => (
              <Reveal key={detail.title}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/68 p-6 sm:p-7">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {detail.title}
                  </h2>
                  <p className="muted-copy mt-5 text-base sm:text-lg">
                    {detail.description}
                  </p>
                  {detail.items?.length ? (
                    <ul className="mt-6 grid gap-3">
                      {detail.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-[var(--muted)]"
                        >
                          <Check
                            size={16}
                            className="mt-1 shrink-0 text-[var(--accent)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            ))}
            {project.challenges?.length ? (
              <Reveal>
                <h2 className="text-3xl font-bold tracking-tight">
                  {project.challengesHeading ?? "Key challenges"}
                </h2>
                <ul className="mt-6 grid gap-4">
                  {project.challenges.map((challenge) => (
                    <li
                      key={challenge}
                      className="flex gap-4 border-b border-[var(--border)] pb-4 text-[var(--muted)]"
                    >
                      <Check
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--accent)]"
                      />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>
      <section className="section-pad border-y border-[var(--border)] bg-[var(--surface)]/45">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">
              {project.resultsEyebrow ?? "Impact"}
            </span>
            <h2 className="section-title mt-6">
              {project.resultsTitle ?? "Results that move the product forward."}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {project.results.map((result, resultIndex) => (
              <Reveal key={result} delay={resultIndex * 0.05}>
                <div className="card-surface rounded-2xl p-7">
                  <span className="font-mono text-xs text-[var(--accent)]">
                    0{resultIndex + 1}
                  </span>
                  <p className="mt-10 text-xl leading-snug font-bold">
                    {result}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell">
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/35 p-6 transition hover:border-[var(--border-hover)] sm:p-9"
          >
            <div>
              <p className="text-xs tracking-[0.14em] text-[var(--foreground-muted)] uppercase">
                Next case study
              </p>
              <p className="mt-2 text-2xl font-bold">{next.title}</p>
            </div>
            <ArrowRight className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
