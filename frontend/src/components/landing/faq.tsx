"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, ChevronDown, ChevronUp, Tag, Sparkles, Shield, Globe, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { translations, type Locale } from "@/lib/i18n/translations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "getting-started", label: "Getting Started", icon: Zap },
  { key: "billing", label: "Billing & Plans", icon: Shield },
  { key: "features", label: "Features", icon: Globe },
  { key: "technical", label: "Technical", icon: Tag },
] as const;

export function FAQ() {
  const { t, locale } = useTranslation();
  const dict = translations[locale as Locale] ?? translations.en;
  const items = dict.faq.items;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  // Add category to each FAQ item based on keywords
  const categorizedItems = React.useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      id: `faq-${index}`,
      category: categorizeFAQ(item.q, item.a),
    }));
  }, [items, locale]);

  const filteredItems = React.useMemo(() => {
    return categorizedItems.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categorizedItems, searchQuery, activeCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
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
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{t("faq.eyebrow") || "Frequently Asked Questions"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("faq.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            {t("faq.subtitle") || "Everything you need to know about Eastern AI Consultant."}
          </motion.p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" aria-hidden />
            <Input
              type="search"
              placeholder={t("faq.searchPlaceholder") || "Search questions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base"
              aria-label={t("faq.searchAria") || "Search FAQ"}
            />
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04, duration: 0.3 }}
              onClick={() => setActiveCategory(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                activeCategory === cat.key
                  ? "bg-gradient-to-r text-white shadow-lg shadow-primary/30"
                  : "bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60",
                "whitespace-nowrap",
              )}
            >
              <cat.icon className="h-4 w-4" aria-hidden />
              {t(`faq.categories.${cat.key}`) || cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mb-6 text-center text-sm text-muted-foreground"
        >
          {filteredItems.length === categorizedItems.length
            ? t("faq.showingAll", { count: filteredItems.length }) || `Showing all ${filteredItems.length} questions`
            : t("faq.showingFiltered", { count: filteredItems.length, total: categorizedItems.length }) || `Showing ${filteredItems.length} of ${categorizedItems.length} questions`}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="multiple" className="w-full space-y-3" activeValue={openItems} onValueChange={setOpenItems}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  index={i}
                  isOpen={openItems.includes(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 rounded-2xl border border-border/60 bg-muted/50"
              >
                <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {t("faq.noResults") || "No questions match your search. Try a different keyword or category."}
                </p>
              </motion.div>
            )}
          </Accordion>
        </motion.div>

        {/* CTA for more help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            {t("faq.ctaText") || "Still have questions?"}
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 text-primary font-medium hover:underline transition-colors">
            {t("faq.ctaLink") || "Contact our support team"}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { id: string; q: string; a: string; category: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const categoryConfig = CATEGORIES.find((c) => c.key === item.category) || CATEGORIES[0];
  const CategoryIcon = categoryConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      layout
    >
      <AccordionItem value={item.id} className="overflow-hidden rounded-xl border border-border/60 bg-card/80 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
        <AccordionTrigger
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium",
            "hover:bg-muted/50 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
            "data-[state=open]:bg-muted/50",
          )}
        >
          <div className="flex items-center gap-3 flex-1 pr-4">
            <Badge
              variant="outline"
              className={cn(
                "text-xs gap-1.5 px-2.5 py-1",
                "bg-primary/10 text-primary border-primary/20",
              )}
            >
              <CategoryIcon className="h-3 w-3" aria-hidden />
              {categoryConfig.label}
            </Badge>
            <span>{item.q}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 text-muted-foreground"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </AccordionTrigger>
        <AnimatePresence>
          {isOpen && (
            <AccordionContent className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6 text-base leading-relaxed"
              >
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {item.a.split("\n").map((paragraph, pi) => (
                    <p key={pi} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AccordionContent>
          )}
        </AnimatePresence>
      </AccordionItem>
    </motion.div>
  );
}

function categorizeFAQ(question: string, answer: string): string {
  const text = (question + " " + answer).toLowerCase();

  if (text.includes("price") || text.includes("cost") || text.includes("plan") || text.includes("bill") || text.includes("subscription") || text.includes("free") || text.includes("trial")) {
    return "billing";
  }
  if (text.includes("agent") || text.includes("feature") || text.includes("tool") || text.includes("automation") || text.includes("course") || text.includes("academy") || text.includes("language")) {
    return "features";
  }
  if (text.includes("api") || text.includes("technical") || text.includes("integration") || text.includes("deploy") || text.includes("security") || text.includes("data") || text.includes("privacy")) {
    return "technical";
  }
  if (text.includes("start") || text.includes("begin") || text.includes("sign up") || text.includes("account") || text.includes("login") || text.includes("how to") || text.includes("get started")) {
    return "getting-started";
  }

  return "getting-started";
}