"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Sparkles, Globe, Users, Zap } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const sections = [
    {
      key: "product",
      title: t("footer.product"),
      icon: Sparkles,
      links: [
        { href: "/academy", label: "Academy" },
        { href: "/chat", label: "AI Assistant" },
        { href: "/business", label: "Business AI" },
        { href: "/automation", label: "Automation" },
        { href: "/tools", label: "AI Tools" },
      ],
    },
    {
      key: "company",
      title: t("footer.company"),
      icon: Users,
      links: [
        { href: "/about", label: t("footer.about") },
        { href: "/careers", label: t("footer.careers") },
        { href: "/partners", label: t("footer.partners") },
        { href: "/contact", label: t("footer.contact") },
      ],
    },
    {
      key: "legal",
      title: t("footer.legal"),
      icon: Shield,
      links: [
        { href: "/privacy", label: t("footer.privacy") },
        { href: "/terms", label: t("footer.terms") },
      ],
    },
    {
      key: "resources",
      title: t("footer.resources"),
      icon: Globe,
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/docs", label: "Documentation" },
        { href: "/api", label: "API Reference" },
        { href: "/status", label: "System Status" },
        { href: "/community", label: "Community" },
      ],
    },
  ] as const;

  const validateEmail = (value: string) => {
    if (!value.trim()) return t("footer.emailRequired") || "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("footer.emailInvalid") || "Please enter a valid email";
    return "";
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    // Simulate API call
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative border-t border-border bg-background/60">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-muted/30 to-transparent" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      <div className="container relative py-16 lg:py-20">
        {/* Main grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[2fr_repeat(4,1fr)]"
        >
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-6"
          >
            <Logo href="/" className="w-auto" />
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline") || "Empowering Africa's next generation of AI builders, entrepreneurs, and innovators."}
            </p>

            {/* Newsletter signup */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium">{t("footer.newsletterTitle") || "Stay updated"}</p>
              <p className="text-xs text-muted-foreground">
                {t("footer.newsletterDesc") || "Get the latest AI insights, tutorials, and platform updates."}
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" aria-hidden />
                  <Input
                    type="email"
                    placeholder={t("footer.emailPlaceholder") || "you@example.com"}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                    className={cn("pl-10", emailError && "border-destructive focus:border-destructive")}
                    disabled={subscribed}
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0" disabled={subscribed} aria-label="Subscribe">
                    {subscribed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    id="email-error"
                    className="text-xs text-destructive"
                    role="alert"
                  >
                    {emailError}
                  </motion.p>
                )}
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-emerald-500"
                  >
                    {t("footer.subscribed") || "Thanks for subscribing!"}
                  </motion.p>
                )}
              </form>
            </motion.div>

            {/* Language + Theme + Social */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              <LanguageSwitcher />
              <ThemeToggle />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <a
                href="https://www.linkedin.com/in/lemessa-ahmed-765476332"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn — Lemessa Ahmed"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  "bg-muted/50 text-muted-foreground hover:text-primary",
                  "hover:bg-primary/10 border border-border/60 hover:border-primary/40",
                  "transition-all duration-300",
                )}
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/lemessaA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub — lemessaA"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  "bg-muted/50 text-muted-foreground hover:text-primary",
                  "hover:bg-primary/10 border border-border/60 hover:border-primary/40",
                  "transition-all duration-300",
                )}
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/lemikind"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) — @lemikind"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  "bg-muted/50 text-muted-foreground hover:text-primary",
                  "hover:bg-primary/10 border border-border/60 hover:border-primary/40",
                  "transition-all duration-300",
                )}
              >
                <Twitter className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Navigation columns */}
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + sectionIndex * 0.06, duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" aria-hidden />
                <h4 className="font-display text-sm font-semibold tracking-tight">{section.title}</h4>
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + sectionIndex * 0.06 + linkIndex * 0.03, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative inline-flex items-center gap-1.5 text-sm text-muted-foreground",
                        "hover:text-foreground transition-colors duration-200",
                        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0",
                        "after:bg-gradient-to-r after:from-primary after:to-accent",
                        "after:transition-all after:duration-300",
                        "hover:after:w-full",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      )}
                    >
                      {link.label}
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row"
        >
          <div className="flex items-center justify-center gap-4 text-center sm:text-left">
            <span>{t("footer.copyright", { year })}</span>
            <span className="hidden sm:inline">·</span>
            <span>Made with care in the Horn of Africa.</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs">
              <Globe className="h-3 w-3" />
              <span>EN • AM • OM • SO</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs">
              <Zap className="h-3 w-3" />
              <span>Powered by Groq</span>
            </Badge>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// Need to import CheckCircle2
import { CheckCircle2, Shield } from "lucide-react";