import { Reveal } from "@/components/animations/reveal";
import { ProjectFilter } from "@/components/projects/project-filter";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/lib/projects";

export function FeaturedProjects() {
  return (
    <section className="section-pad bg-[var(--surface)]/45" id="work">
      <div className="container-shell">
        <Reveal className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title="Explore the projects."
            description="Two different product workflows: a creative interface and a grocery storefront. Open the demos or explore how they are built."
          />
          <ButtonLink
            href="/projects"
            variant="text"
            className="shrink-0 justify-start"
          >
            All projects
          </ButtonLink>
        </Reveal>
        <Reveal className="mt-12">
          <ProjectFilter
            projects={projects.filter((project) => project.featured)}
          />
        </Reveal>
      </div>
    </section>
  );
}
