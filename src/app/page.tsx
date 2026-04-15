import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/hero-section";
import { FeatureGrid } from "@/components/feature-grid";
import { CtaBanner } from "@/components/cta-banner";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <FeatureGrid />
      <CtaBanner />
      <SiteFooter />
    </>
  );
}