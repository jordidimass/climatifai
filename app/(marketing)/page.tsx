import { BuildSection } from "@/components/marketing/build-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <BuildSection />
      <CtaSection />
    </>
  );
}

