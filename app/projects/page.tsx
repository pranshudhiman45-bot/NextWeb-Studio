import type { Metadata } from "next";
import { PageTransition } from "@/components/animations/page-transition";
import { Reveal } from "@/components/animations/reveal";
import { ContactCta } from "@/components/contact/contact-cta";
import { ProjectFilter } from "@/components/projects/project-filter";
import { PageHero } from "@/components/ui/page-hero";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore real projects and working applications built by Vinay Kumar and presented through NextWeb Studio.",
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Projects and products"
        title="Selected work, built for real use."
        description="Real projects and working applications built by Vinay Kumar and presented through NextWeb Studio, with factual case studies and live links."
      />
      <section className="section-pad">
        <div className="container-shell">
          <Reveal>
            <ProjectFilter projects={projects} searchable />
          </Reveal>
        </div>
      </section>
      <ContactCta />
    </PageTransition>
  );
}
