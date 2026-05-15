"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export function CTA() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-plum/10 to-accent/15 px-8 py-16 text-center sm:px-12 sm:py-20">
          <div className="absolute inset-0 -z-10 grid-pattern-bg opacity-50" aria-hidden />
          <div className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" aria-hidden />

          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Build the future, in your language.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join 12,000+ African students, entrepreneurs and NGOs using Eastern AI to learn, build,
            and grow with AI.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/signup">
              <Button variant="gradient" size="xl">
                {t("hero.startLearning")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="xl">
                {t("hero.tryAssistant")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
