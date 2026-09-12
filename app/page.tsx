import { AboutPreview } from "@/components/about/about-preview";
import { PageTransition } from "@/components/animations/page-transition";
import { Hero } from "@/components/hero/hero";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ServicesPreview } from "@/components/services/services-preview";
import { TechnologyGrid } from "@/components/skills/technology-grid";
import { ProductReveal } from "@/components/product-reveal/product-reveal";
import { ProductSelector } from "@/components/solutions/product-selector";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <TechnologyGrid />
      <ProductSelector />
      <ProductReveal />
      <FeaturedProjects />
      <ServicesPreview />
      <ProcessTimeline />
      <AboutPreview />
    </PageTransition>
  );
}
