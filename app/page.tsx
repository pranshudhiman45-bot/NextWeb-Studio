import { AboutPreview } from "@/components/about/about-preview";
import { PageTransition } from "@/components/animations/page-transition";
import { ContactCta } from "@/components/contact/contact-cta";
import { Hero } from "@/components/hero/hero";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ServicesPreview } from "@/components/services/services-preview";
import { SolutionsGrid } from "@/components/services/solutions-grid";
import { TechnologyGrid } from "@/components/skills/technology-grid";
import { ProductSelector } from "@/components/solutions/product-selector";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <TechnologyGrid />
      <ProductSelector />
      <SolutionsGrid />
      <FeaturedProjects />
      <ServicesPreview />
      <ProcessTimeline />
      <AboutPreview />
      <ContactCta />
    </PageTransition>
  );
}
