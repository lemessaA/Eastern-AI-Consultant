import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import {
  LandingAgentsLazy,
  LandingCTALazy,
  LandingFAQLazy,
  LandingFeaturesLazy,
  LandingPricingLazy,
  LandingStatsLazy,
  LandingTestimonialsLazy,
} from "@/components/landing/dynamic";
import { LandingNavbar } from "@/components/landing/navbar";

/** Hero + navbar above the fold; below-fold landing sections stream in separately to cut initial JS. */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <LandingStatsLazy />
        <LandingFeaturesLazy />
        <LandingAgentsLazy />
        <LandingTestimonialsLazy />
        <LandingPricingLazy />
        <LandingFAQLazy />
        <LandingCTALazy />
      </main>
      <Footer />
    </div>
  );
}
