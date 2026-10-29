"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Zap, Globe, Users, Brain } from "lucide-react";

import { marketingImages } from "@/lib/marketing-images";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/** Compact image strip on auth pages (mobile / tablet where the side panel is hidden). */
export function AuthMobileBanner() {
  const { t } = useTranslation();

  const features = [
    { icon: Brain, label: "auth.banner.aiAgents" || "AI Agents", color: "from-violet-500 to-fuchsia-500" },
    { icon: Users, label: "auth.banner.community" || "Community", color: "from-cyan-500 to-blue-500" },
    { icon: Zap, label: "auth.banner.automation" || "Automation", color: "from-amber-500 to-orange-500" },
    { icon: Globe, label: "auth.banner.languages" || "4 Languages", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8 overflow-hidden rounded-2xl lg:hidden"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, hsl(var(--primary)/0.2), transparent 50%),
          radial-gradient(ellipse at 50% 100%, hsl(var(--accent)/0.15), transparent 50%)
        `
      }}
    >
      {/* Background image with parallax effect */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={marketingImages.auth.primary}
          alt=""
          fill
          className="object-cover object-[center_30%] transition-transform duration-700 hover:scale-105"
          sizes="100vw"
          priority
        />
      </div>

      {/* Layered gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-background/30 to-amber-950/50" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--primary)/0.35),transparent_50%),radial-gradient(ellipse_at_70%_80%,hsl(var(--accent)/0.25),transparent_50%)]"
        aria-hidden
      />

      {/* Floating animated orbs */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative p-6">
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4"
        >
          <p className="font-display text-xl font-bold text-white drop-shadow-sm">
            Eastern AI Consultant
          </p>
          <p className="text-sm text-white/70 mt-1">
            {t("auth.banner.tagline") || "AI learning & business for Africa"}
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
              className="group"
              whileHover={{ scale: 1.05 }}
            >
              <div className={cn(
                "flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md",
                "border border-white/20",
                "transition-all duration-300",
                "hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-primary/20"
              )}>
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white",
                  `bg-gradient-to-r ${feature.color}`
                )}>
                  <feature.icon className="h-3 w-3" aria-hidden />
                </div>
                <span className="text-xs font-medium text-white/90 whitespace-nowrap">
                  {t(feature.label)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50"
        >
          <span>{t("auth.banner.swipeHint") || "Swipe to explore"}</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}