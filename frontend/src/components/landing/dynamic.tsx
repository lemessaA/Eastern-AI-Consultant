import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-3xl bg-muted/30 ring-1 ring-border/60", className)} aria-hidden />
  );
}

const loadingBlock = () => (
  <div className="py-24 sm:py-32">
    <SectionSkeleton className="mx-auto h-64 max-w-4xl" />
  </div>
);

export const LandingStatsLazy = dynamic(
  () => import("@/components/landing/stats").then((mod) => ({ default: mod.Stats })),
  { loading: loadingBlock },
);

export const LandingFeaturesLazy = dynamic(
  () => import("@/components/landing/features").then((mod) => ({ default: mod.Features })),
  { loading: loadingBlock },
);

export const LandingAgentsLazy = dynamic(
  () => import("@/components/landing/agents-showcase").then((mod) => ({ default: mod.AgentsShowcase })),
  { loading: loadingBlock },
);

export const LandingTestimonialsLazy = dynamic(
  () => import("@/components/landing/testimonials").then((mod) => ({ default: mod.Testimonials })),
  { loading: loadingBlock },
);

export const LandingPricingLazy = dynamic(
  () => import("@/components/landing/pricing").then((mod) => ({ default: mod.Pricing })),
  { loading: loadingBlock },
);

export const LandingFAQLazy = dynamic(
  () => import("@/components/landing/faq").then((mod) => ({ default: mod.FAQ })),
  { loading: loadingBlock },
);

export const LandingCTALazy = dynamic(
  () => import("@/components/landing/cta").then((mod) => ({ default: mod.CTA })),
  { loading: loadingBlock },
);
