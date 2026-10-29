"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    features: [
      "Access to AI Teacher agent",
      "5 free courses",
      "10 AI chat messages / day",
      "Community forum access",
      "Basic progress tracking",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: { monthly: 19, annual: 15 },
    features: [
      "All 10 AI agents",
      "Unlimited AI chat",
      "All courses + certificates",
      "Business reports + SWOT analysis",
      "10 automation flows/month",
      "Priority Groq inference",
      "Advanced analytics dashboard",
      "API access (10k calls/mo)",
    ],
    cta: "Start Free Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: { monthly: 149, annual: 129 },
    features: [
      "Everything in Pro",
      "Custom AI agents",
      "Dedicated consultant (4h/mo)",
      "Unlimited automations",
      "Private vector knowledge base",
      "SSO + audit logs + SLA",
      "On-premise deployment option",
      "Custom integrations",
      "Priority support (2h SLA)",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
] as const;

const ALL_FEATURES = [
  { key: "agents", label: "AI Agents Access", free: 1, pro: 10, enterprise: "Custom" },
  { key: "chat", label: "AI Chat Messages", free: "10/day", pro: "Unlimited", enterprise: "Unlimited" },
  { key: "courses", label: "Courses & Certificates", free: 5, pro: "All", enterprise: "All + Custom" },
  { key: "business", label: "Business Tools", free: false, pro: true, enterprise: true },
  { key: "automation", label: "Automation Flows", free: 0, pro: "10/mo", enterprise: "Unlimited" },
  { key: "analytics", label: "Analytics Dashboard", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { key: "api", label: "API Access", free: false, pro: "10k/mo", enterprise: "Unlimited" },
  { key: "support", label: "Support", free: "Community", pro: "Priority", enterprise: "2h SLA" },
  { key: "sso", label: "SSO & Audit Logs", free: false, pro: false, enterprise: true },
  { key: "deployment", label: "On-premise Option", free: false, pro: false, enterprise: true },
] as const;

export function Pricing() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = React.useState(false);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute inset-0 grid-pattern-bg opacity-30" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      <div className="container relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{t("pricing.eyebrow") || "Simple, transparent pricing"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("pricing.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            {t("pricing.subtitle")}
          </motion.p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-xs mb-12"
        >
          <div className="flex items-center justify-center gap-4 p-1 rounded-xl bg-muted/50 border border-border/60">
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
              {t("pricing.monthly") || "Monthly"}
            </span>
            <Toggle
              pressed={isAnnual}
              onPressedChange={setIsAnnual}
              className={cn(
                "relative h-6 w-11 rounded-full border-2 transition-all duration-300",
                isAnnual
                  ? "bg-gradient-to-r from-primary to-accent border-transparent"
                  : "bg-muted border-border",
              )}
              aria-label={t("pricing.billingToggle") || "Toggle billing period"}
            >
              <motion.span
                className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300"
                animate={{ x: isAnnual ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />
            </Toggle>
            <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>
              {t("pricing.annual") || "Annual"}
              <span className="ml-1.5 text-xs text-emerald-500 font-semibold">−20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} isAnnual={isAnnual} index={i} />
          ))}
        </motion.div>

        {/* Feature comparison table - NEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="font-display text-2xl font-bold text-center mb-8">
            {t("pricing.compareTitle") || "Feature Comparison"}
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/50">
                  <th className="text-left p-4 font-semibold">{t("pricing.feature") || "Feature"}</th>
                  {PLANS.map((plan) => (
                    <th key={plan.key} className="text-center p-4 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feature, fi) => (
                  <motion.tr
                    key={feature.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + fi * 0.03, duration: 0.3 }}
                    className={cn("border-b border-border/40", fi % 2 === 0 && "bg-muted/30")}
                  >
                    <td className="p-4 font-medium">{feature.label}</td>
                    {PLANS.map((plan) => (
                      <td key={plan.key} className="text-center p-4">
                        <FeatureValue
                          value={feature[plan.key as keyof typeof feature]}
                          highlight={plan.highlight}
                        />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Guarantee badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <GuaranteeBadge icon={Shield} title="14-day free trial" desc="No credit card required" />
          <GuaranteeBadge icon={RefreshCw} title="Cancel anytime" desc="No questions asked" />
          <GuaranteeBadge icon={Globe} title="Available in 4 languages" desc="English, Amharic, Oromo, Somali" />
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ plan, isAnnual, index }: { plan: typeof PLANS[0]; isAnnual: boolean; index: number }) {
  const { t } = useTranslation();
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "card-hover relative overflow-hidden h-full",
          "bg-gradient-to-br from-background to-muted/30",
          "border-border/60 hover:border-primary/40",
          "hover:shadow-2xl hover:shadow-primary/10",
          "transition-all duration-500",
          plan.highlight && "border-primary/60 shadow-xl shadow-primary/10",
        )}
      >
        {/* Top accent line */}
        {plan.highlight && (
          <motion.div
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 1] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left"
          />
        )}

        {/* Popular badge */}
        {plan.highlight && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <Badge variant="gradient" className="gap-1 px-3 py-1">
              <Sparkles className="h-3 w-3" />
              {plan.badge || t("pricing.mostPopular")}
            </Badge>
          </motion.div>
        )}

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <div className="mt-3 flex items-baseline justify-center gap-1">
            <motion.span
              key={isAnnual}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display text-5xl font-bold"
            >
              {price === 0 ? "Free" : `$${price}`}
            </motion.span>
            <span className="text-muted-foreground text-sm">
              {t("pricing.perMonth") || "/month"}
              {isAnnual && price > 0 && (
                <span className="ml-2 text-xs text-emerald-500 font-semibold">
                  {t("pricing.billedAnnually") || "billed annually"}
                </span>
              )}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-3 text-sm">
            {plan.features.map((feature, fi) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + fi * 0.05, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <Check className={cn(
                  "h-5 w-5 mt-0.5 shrink-0",
                  price === 0 ? "text-muted-foreground/40" : "text-success"
                )} />
                <span className={cn(price === 0 ? "text-muted-foreground/60" : "")}>{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full mt-2",
              plan.highlight
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                : "border border-border/60 hover:border-primary/40 hover:bg-muted/50",
            )}
            size="lg"
          >
            {plan.cta}
          </motion.button>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FeatureValue({ value, highlight }: { value: string | number | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={cn("h-4 w-4 mx-auto text-success", highlight && "text-primary")} />
    ) : (
      <span className="text-muted-foreground/40">—</span>
    );
  }
  return (
    <span className={cn("font-medium", highlight && "text-primary")}>{value}</span>
  );
}

function GuaranteeBadge({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

// Need to import these icons
import { Shield, RefreshCw, Globe } from "lucide-react";