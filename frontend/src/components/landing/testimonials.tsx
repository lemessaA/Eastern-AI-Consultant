"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import * as React from "react";

const QUOTES = [
  {
    name: "Selamawit Tadesse",
    role: "Founder, Adama Coffee Co.",
    country: "🇪🇹 Adama",
    avatar: "/avatars/selamawit.jpg",
    body: "I cancelled three apps after switching to Eastern AI. The Business Consultant gave us a 30-day plan that grew our WhatsApp orders by 38% in 6 weeks.",
    rating: 5,
  },
  {
    name: "Abdirahman Yusuf",
    role: "Agronomist",
    country: "🇸🇴 Hargeisa",
    avatar: "/avatars/abdirahman.jpg",
    body: "The Agriculture Advisor speaks Somali. My farmers can finally ask questions in their language and get answers that actually fit our climate.",
    rating: 5,
  },
  {
    name: "Caaltuu Hassan",
    role: "Computer Science student",
    country: "🇪🇹 Jigjiga",
    avatar: "/avatars/caaltuu.jpg",
    body: "I learned prompt engineering in one weekend with the AI Teacher. Three weeks later I landed a remote intern role. Life-changing.",
    rating: 5,
  },
  {
    name: "Dawit Bekele",
    role: "Marketing Manager",
    country: "🇪🇹 Addis Ababa",
    avatar: "/avatars/dawit.jpg",
    body: "We replaced our $1,200/mo agency with the Marketing Assistant. It writes better hooks in Amharic than our previous copywriters.",
    rating: 5,
  },
  {
    name: "Hodan Ahmed",
    role: "NGO Programme Lead",
    country: "🇸🇴 Mogadishu",
    avatar: "/avatars/hodan.jpg",
    body: "The automation workflows let our 4-person team behave like a 12-person team. WhatsApp lead capture alone saved us 9 hours a week.",
    rating: 5,
  },
  {
    name: "Lemma Tolosa",
    role: "Smallholder farmer",
    country: "🇪🇹 Nekemte",
    avatar: "/avatars/lemma.jpg",
    body: "I uploaded a photo of my coffee leaves and got an answer in Afaan Oromoo with three treatments. Worked. Saved my whole season.",
    rating: 5,
  },
] as const;

export function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  // Auto-rotate
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide((currentIndex + 1) % QUOTES.length);
      } else {
        goToSlide((currentIndex - 1 + QUOTES.length) % QUOTES.length);
      }
    }
    setTouchStart(null);
  };

  // Visible slides (3 on desktop, 2 on tablet, 1 on mobile)
  const visibleCount = typeof window !== "undefined" ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1) : 3;
  const visibleQuotes = Array.from({ length: visibleCount }, (_, i) => QUOTES[(currentIndex + i) % QUOTES.length]);

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute inset-0 grid-pattern-bg opacity-30" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
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
            <Star className="h-3.5 w-3.5 text-warning fill-warning" />
            <span className="text-muted-foreground">{t("testimonials.eyebrow") || "Loved across the continent"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("testimonials.title") || "Real stories from students, entrepreneurs, and farmers in East Africa."}
          </motion.h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation arrows */}
          <motion.button
            onClick={() => goToSlide((currentIndex - 1 + QUOTES.length) % QUOTES.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 border border-border/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors lg:-translate-x-10"
            aria-label="Previous testimonial"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>

          <motion.button
            onClick={() => goToSlide((currentIndex + 1) % QUOTES.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 border border-border/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors lg:translate-x-10"
            aria-label="Next testimonial"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none lg:w-32" aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none lg:w-32" aria-hidden />

          {/* Carousel track */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4"
          >
            {visibleQuotes.map((quote, i) => (
              <TestimonialCard key={quote.name} quote={quote} index={i} isActive={i === 0} />
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-10 flex items-center justify-center gap-2"
        >
          {QUOTES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goToSlide(i)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                i === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === currentIndex ? "true" : "false"}
            />
          ))}
        </motion.div>

        {/* Pause/Play indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground/60"
        >
          <span>{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
          <motion.span
            animate={{ opacity: isAutoPlaying ? [1, 0.5, 1] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block ml-1"
          >
            ●
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, index, isActive }: { quote: typeof QUOTES[0]; index: number; isActive: boolean }) {
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 snap-start w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)]"
      style={{ x: springX }}
      whileHover={{ y: -8 }}
    >
      <Card className={cn(
        "card-hover h-full relative overflow-hidden",
        "bg-gradient-to-br from-background to-muted/30",
        "border-border/60 hover:border-primary/40",
        "hover:shadow-2xl hover:shadow-primary/10",
        "transition-all duration-500",
      )}>
        <CardContent className="flex h-full flex-col p-6">
          {/* Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Quote className="h-5 w-5" />
          </motion.div>

          {/* Quote text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex-1 text-sm leading-relaxed"
          >
            "{quote.body}"
          </motion.p>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={quote.avatar} alt={quote.name} />
              <AvatarFallback>{initials(quote.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{quote.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {quote.role} · {quote.country}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: quote.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-warning fill-warning" />
              ))}
            </div>
          </motion.div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden />
        </CardContent>
      </Card>
    </motion.div>
  );
}