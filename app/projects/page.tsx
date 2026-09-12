import { pageMetadata } from "@/lib/metadata";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ProjectFilter } from "@/components/projects/project-filter";
import { PageHero } from "@/components/ui/page-hero";
import { projects } from "@/lib/projects";

export const metadata = pageMetadata(
  "Projects",
  "Explore Ryora and Buy Best: project interfaces, implementation details, source links and live previews from NextWeb Studio.",
  "/projects",
);

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Projects and products"
        title="Selected work, built for real use."
        description="Browse the creative-workspace demo and the grocery storefront. Each case study separates source implementation from what has been checked live."
      />
      <section className="section-pad">
        <div className="container-shell">
          <Reveal>
            <ProjectFilter projects={projects} searchable />
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
