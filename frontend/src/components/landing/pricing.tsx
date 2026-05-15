"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: 0,
    features: [
      "Access to AI Teacher",
      "5 free courses",
      "10 AI chat messages / day",
      "Community forum",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 19,
    highlight: true,
    features: [
      "All 10 AI agents",
      "Unlimited AI chat",
      "All courses + certificates",
      "Business reports + SWOT",
      "10 automation flows",
      "Priority Groq inference",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 149,
    features: [
      "Everything in Pro",
      "Custom AI agents",
      "Dedicated consultant (4h/mo)",
      "Unlimited automations",
      "Private vector knowledge base",
      "SSO + audit logs + SLA",
    ],
  },
];

export function Pricing() {
  const { t } = useTranslation();
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30 border-y border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("pricing.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card
              key={p.key}
              className={`relative card-hover h-full ${
                p.highlight ? "border-primary/60 shadow-xl shadow-primary/10" : ""
              }`}
            >
              {p.highlight && (
                <Badge variant="gradient" className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                  <Sparkles className="h-3 w-3" /> {t("pricing.mostPopular")}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">${p.price}</span>
                  <span className="text-muted-foreground text-sm">{t("pricing.perMonth")}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/auth/signup?plan=${p.key}`} className="block">
                  <Button variant={p.highlight ? "gradient" : "outline"} className="w-full" size="lg">
                    {t("pricing.cta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
