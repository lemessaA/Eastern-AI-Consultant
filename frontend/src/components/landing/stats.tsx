"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Globe2, Languages, Users, Award, Zap, Sparkles } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const statConfigs = [
  { icon: Users, value: 12800, suffix: "+", labelKey: "stats.students", color: "from-violet-500 to-fuchsia-500", bgColor: "from-violet-500/10 to-fuchsia-500/10" },
  { icon: Briefcase, value: 1450, suffix: "+", labelKey: "stats.businesses", color: "from-cyan-500 to-blue-500", bgColor: "from-cyan-500/10 to-blue-500/10" },
  { icon: Globe2, value: 18, suffix: "", labelKey: "stats.countries", color: "from-emerald-500 to-teal-500", bgColor: "from-emerald-500/10 to-teal-500/10" },
  { icon: Languages, value: 4, suffix: "", labelKey: "stats.languages", color: "from-amber-500 to-orange-500", bgColor: "from-amber-500/10 to-orange-500/10" },
] as const;

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function Stats() {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 sm:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" aria-hidden />
      <div className="absolute inset-0 -z-10 grid-pattern-bg opacity-30" aria-hidden />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("stats.title") || "Our Impact Across Africa"}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("stats.subtitle") || "Real results from students, entrepreneurs, and organizations across the continent."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {statConfigs.map((config, i) => (
            <motion.div
              key={config.labelKey}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative"
            >
              <StatCard config={config} />
            </motion.div>
          ))}
        </div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          aria-hidden
        />
      </div>
    </section>
  );
}

function StatCard({ config }: { config: typeof statConfigs[0] }) {
  const { t } = useTranslation();
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    const el = document.currentScript?.parentElement;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCount = () => {
    const duration = 1500;
    const startTime = Date.now();
    const target = config.value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(target * eased));

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const Icon = config.icon;
  const displayValue = formatNumber(count || (isVisible ? 0 : config.value));

  return (
    <div className="relative group">
      {/* Gradient border glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-gradient-to-br ${config.color}`
        )}
        style={{ filter: "blur(8px)" }}
        aria-hidden
      />

      <div
        className={cn(
          "relative rounded-2xl p-6 text-center border",
          "bg-gradient-to-br from-background to-muted/50",
          "border-border/60 hover:border-primary/40",
          "shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10",
          "transition-all duration-500",
          "hover:-translate-y-1 hover:scale-[1.02]",
          `before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br ${config.bgColor} before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500`
        )}
      >
        {/* Icon with animated background */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${config.color.replace("from-", "").replace("to-", "")})` }}
        >
          <Icon className="h-7 w-7 text-white" aria-hidden />
        </motion.div>

        {/* Animated counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display text-3xl sm:text-4xl font-bold"
          style={{ background: `linear-gradient(135deg, ${config.color.replace("from-", "").replace("to-", "")})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {displayValue}
          <span className="text-foreground" style={{ WebkitTextFillColor: "currentColor" }}>{config.suffix}</span>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-sm font-medium text-muted-foreground"
        >
          {t(config.labelKey)}
        </motion.p>

        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" aria-hidden />
      </div>
    </div>
  );
}