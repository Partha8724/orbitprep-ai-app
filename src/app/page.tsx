import Navbar from "@/components/Navbar";
import ScrollHero from "@/components/ScrollHero";
import FeaturesSection from "@/components/FeaturesSection";
import { PremiumHomeSections } from "@/components/premium-home-sections";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <ScrollHero />
      <FeaturesSection />
      <PremiumHomeSections />
    </main>
  );
}
