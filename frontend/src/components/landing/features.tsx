"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  GraduationCap,
  Sprout,
  Workflow,
  UserCheck,
  Zap,
  Sparkles,
  Shield,
  BarChart3,
  Globe,
  Brain,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const features = [
  {
    key: "chat",
    icon: Bot,
    color: "from-violet-500 to-fuchsia-500",
    bgColor: "from-violet-500/10 to-fuchsia-500/10",
    borderColor: "border-violet-500/20",
    hoverColor: "hover:border-violet-500/50",
  },
  {
    key: "academy",
    icon: GraduationCap,
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-500/10 to-blue-500/10",
    borderColor: "border-cyan-500/20",
    hoverColor: "hover:border-cyan-500/50",
  },
  {
    key: "business",
    icon: Briefcase,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/20",
    hoverColor: "hover:border-amber-500/50",
  },
  {
    key: "automation",
    icon: Workflow,
    color: "from-fuchsia-500 to-pink-500",
    bgColor: "from-fuchsia-500/10 to-pink-500/10",
    borderColor: "border-fuchsia-500/20",
    hoverColor: "hover:border-fuchsia-500/50",
  },
  {
    key: "agriculture",
    icon: Sprout,
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    hoverColor: "hover:border-emerald-500/50",
  },
  {
    key: "career",
    icon: UserCheck,
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-500/10 to-indigo-500/10",
    borderColor: "border-blue-500/20",
    hoverColor: "hover:border-blue-500/50",
  },
] as const;

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background elements */}
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
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur-md"
          >
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="h-3.5 w-3.5 text-primary"
            >
              <Sparkles />
            </motion.span>
            <span className="text-muted-foreground">{t("features.eyebrow") || "Everything you need to succeed"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("features.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            {t("features.subtitle")}
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.key} feature={feature} index={i} />
          ))}
        </motion.div>

        {/* Trust badges row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <TrustBadge icon={Shield} label="Enterprise Security" desc="SOC 2 compliant" color="from-blue-500 to-cyan-500" />
          <TrustBadge icon={Brain} label="AI-Powered" desc="Latest models" color="from-violet-500 to-fuchsia-500" />
          <TrustBadge icon={BarChart3} label="Analytics" desc="Real-time insights" color="from-emerald-500 to-teal-500" />
          <TrustBadge icon={Zap} label="Automation" desc="No-code workflows" color="from-amber-500 to-orange-500" />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { t } = useTranslation();
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <Card
        className={cn(
          "card-hover relative overflow-hidden h-full",
          "bg-gradient-to-br from-background to-muted/30",
          feature.borderColor,
          feature.hoverColor,
          "transition-all duration-500",
          "hover:shadow-2xl hover:shadow-primary/10",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500",
          feature.bgColor,
        )}
      >
        {/* Top accent line */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 transform scale-x-0 origin-left",
            "group-hover:scale-x-100 transition-transform duration-500",
            feature.color,
          )}
          aria-hidden
        />

        <CardContent className="relative p-6 z-10">
          {/* Icon with animated background */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: `linear-gradient(135deg, ${feature.color.replace("from-", "").replace("to-", "")})` }}
          >
            <Icon className="h-7 w-7 text-white" aria-hidden />
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="font-display text-lg font-semibold"
          >
            {t(`features.items.${feature.key}.title`)}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-2 text-sm text-muted-foreground leading-relaxed"
          >
            {t(`features.items.${feature.key}.body`)}
          </motion.p>

          {/* Feature highlights - NEW */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 pt-4 border-t border-border/60 space-y-2"
          >
            {getFeatureHighlights(feature.key).map((highlight, hi) => (
              <motion.div
                key={highlight}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + hi * 0.05, duration: 0.3 }}
                className="flex items-center gap-2 text-xs text-muted-foreground/80"
              >
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${feature.color.replace("from-", "").replace("to-", "")})` }} />
                <span>{t(`features.items.${feature.key}.highlights.${hi}`) || highlight}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrustBadge({ icon: Icon, label, desc, color }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `linear-gradient(135deg, ${color.replace("from-", "").replace("to-", "")})` }}>
        <Icon className="h-5 w-5 text-white" aria-hidden />
      </div>
      <p className="mt-3 font-medium text-sm">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function getFeatureHighlights(key: string): string[] {
  const highlights: Record<string, string[]> = {
    chat: ["10 specialist agents", "Multi-language support", "Sub-second responses", "Context awareness"],
    academy: ["Video courses", "Interactive exercises", "Certificates", "Progress tracking"],
    business: ["SWOT analysis", "30-day action plans", "Market research", "Financial modeling"],
    automation: ["WhatsApp bots", "Email sequences", "Lead capture", "Social posting"],
    agriculture: ["Crop diagnosis", "Weather alerts", "Market prices", "Treatment guides"],
    career: ["ATS-optimized CV", "Cover letters", "Interview prep", "LinkedIn optimization"],
  };
  return highlights[key] || [];
}