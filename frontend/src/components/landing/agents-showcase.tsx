"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Languages,
  LineChart,
  Megaphone,
  Sprout,
  UserCheck,
  Workflow,
  Zap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const agentCategories = [
  { key: "all", label: "All Agents", icon: Sparkles },
  { key: "learning", label: "Learning", icon: GraduationCap, agents: ["AI Teacher", "Student Tutor", "AI Translator"] },
  { key: "business", label: "Business", icon: Briefcase, agents: ["Business Consultant", "Marketing Assistant", "Startup Advisor"] },
  { key: "specialized", label: "Specialized", icon: Brain, agents: ["Agriculture Advisor", "Career Coach", "Automation Expert", "Resume Builder"] },
] as const;

const agents = [
  {
    name: "AI Teacher",
    description: "Personalized lessons, explanations, and practice in any subject. Adapts to your learning style and pace.",
    icon: BookOpen,
    category: "learning",
    color: "from-violet-500 to-fuchsia-500",
    features: ["Multi-language", "Adaptive difficulty", "Progress tracking", "Instant feedback"],
  },
  {
    name: "Business Consultant",
    description: "Strategic planning, SWOT analysis, market research, and 30-day action plans tailored to African markets.",
    icon: Briefcase,
    category: "business",
    color: "from-amber-500 to-orange-500",
    features: ["SWOT analysis", "Market research", "Financial models", "Action plans"],
  },
  {
    name: "Agriculture Advisor",
    description: "Crop diagnosis, pest identification, weather-based advice, and market prices in local languages.",
    icon: Sprout,
    category: "specialized",
    color: "from-emerald-500 to-teal-500",
    features: ["Crop diagnosis", "Pest ID", "Weather alerts", "Market prices"],
  },
  {
    name: "Marketing Assistant",
    description: "Content calendars, social media copy, WhatsApp campaigns, and brand strategy in Amharic, Oromo, Somali, and English.",
    icon: Megaphone,
    category: "business",
    color: "from-pink-500 to-rose-500",
    features: ["Content calendar", "Social copy", "WhatsApp campaigns", "Brand strategy"],
  },
  {
    name: "Career Coach",
    description: "ATS-optimized CVs, cover letters, interview preparation, and LinkedIn optimization for African job markets.",
    icon: UserCheck,
    category: "specialized",
    color: "from-blue-500 to-indigo-500",
    features: ["CV optimization", "Cover letters", "Interview prep", "LinkedIn help"],
  },
  {
    name: "Automation Expert",
    description: "No-code workflows for WhatsApp bots, email sequences, lead capture, and social media scheduling.",
    icon: Workflow,
    category: "specialized",
    color: "from-fuchsia-500 to-purple-500",
    features: ["WhatsApp bots", "Email flows", "Lead capture", "Social scheduling"],
  },
  {
    name: "Resume Builder",
    description: "Professional CVs and cover letters optimized for ATS systems and African employer preferences.",
    icon: GraduationCap,
    category: "learning",
    color: "from-cyan-500 to-blue-500",
    features: ["ATS-friendly", "Local formats", "Multiple templates", "Instant download"],
  },
  {
    name: "AI Translator",
    description: "Accurate translation between English, Amharic, Afaan Oromo, and Somali with cultural context.",
    icon: Languages,
    category: "learning",
    color: "from-indigo-500 to-violet-500",
    features: ["4 languages", "Cultural context", "Business terms", "Voice support"],
  },
  {
    name: "Student Tutor",
    description: "Homework help, exam preparation, and concept explanations aligned with African curricula.",
    icon: BookOpen,
    category: "learning",
    color: "from-teal-500 to-cyan-500",
    features: ["Curriculum aligned", "Exam prep", "Step-by-step", "Practice questions"],
  },
  {
    name: "Startup Advisor",
    description: "Business model canvas, pitch deck guidance, investor readiness, and funding strategy for African startups.",
    icon: LineChart,
    category: "business",
    color: "from-rose-500 to-pink-500",
    features: ["Business model", "Pitch decks", "Investor prep", "Funding strategy"],
  },
] as const;

export function AgentsShowcase() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredAgents = activeCategory === "all"
    ? agents
    : agents.filter((a) => agentCategories.find((c) => c.key === activeCategory)?.agents.includes(a.name));

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute inset-0 grid-pattern-bg opacity-30" />
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
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-3.5 w-3.5 text-accent"
            >
              <Zap />
            </motion.span>
            <span className="text-muted-foreground">{t("agents.eyebrow") || "10 Specialized AI Agents"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("agents.title") || "One platform. Ten experts. Always-on."}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            {t("agents.subtitle") || "Each agent is fine-tuned with domain knowledge for African contexts — from teff farming to WhatsApp commerce. Powered by Groq's sub-second inference and orchestrated through LangGraph."}
          </motion.p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {agentCategories.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              onClick={() => setActiveCategory(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                activeCategory === cat.key
                  ? "bg-gradient-to-r text-white shadow-lg shadow-primary/30"
                  : "bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60",
                "whitespace-nowrap",
              )}
            >
              <cat.icon className="h-4 w-4 mr-2 inline" aria-hidden />
              {t(`agents.categories.${cat.key}`) || cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Agents carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          {/* Scroll indicators */}
          {scrollPosition > 10 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 border border-border/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors lg:-translate-x-6"
              aria-label="Scroll left"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          )}

          <div
            ref={containerRef}
            onScroll={(e) => setScrollPosition((e.currentTarget as HTMLDivElement).scrollLeft)}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          >
            {filteredAgents.map((agent, i) => (
              <AgentCard key={agent.name} agent={agent} index={i} />
            ))}
          </div>

          {scrollPosition < (containerRef.current?.scrollWidth || 0) - (containerRef.current?.clientWidth || 0) - 10 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 border border-border/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors lg:translate-x-6"
              aria-label="Scroll right"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          )}

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none lg:w-32" aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none lg:w-32" aria-hidden />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            {t("agents.ctaText") || "Ready to work with your AI team?"}
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/auth/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                {t("agents.ctaPrimary") || "Start Free"}
              </motion.button>
            </a>
            <a href="/chat" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted hover:border-primary/40 transition-all backdrop-blur"
              >
                <MessageSquare className="h-4 w-4" />
                {t("agents.ctaSecondary") || "Try in Chat"}
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AgentCard({ agent, index }: { agent: typeof agents[0]; index: number }) {
  const Icon = agent.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="flex-shrink-0 snap-start w-[280px] sm:w-[300px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative h-full rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        style={{
          background: `linear-gradient(145deg, hsl(var(--card)), hsl(var(--muted)/30))`,
        }}
      >
        {/* Category badge */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          <Target className="h-3 w-3" aria-hidden />
          <span>{agent.category.charAt(0).toUpperCase() + agent.category.slice(1)}</span>
        </motion.div>

        {/* Icon */}
        <motion.div
          whileHover={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${agent.color.replace("from-", "").replace("to-", "")})` }}
        >
          <Icon className="h-7 w-7 text-white" aria-hidden />
        </motion.div>

        {/* Name */}
        <motion.h3
          className="font-display text-lg font-semibold mb-2"
        >
          {agent.name}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1"
        >
          {agent.description}
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-2 border-t border-border/60 pt-4"
        >
          {agent.features.map((feature, fi) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + fi * 0.04, duration: 0.3 }}
              className="flex items-center gap-2 text-xs text-muted-foreground/80"
            >
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${agent.color.replace("from-", "").replace("to-", "")})` }} />
              <span>{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden />
      </motion.div>
    </motion.div>
  );
}