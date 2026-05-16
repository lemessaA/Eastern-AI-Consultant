"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const sections = [
    {
      title: t("footer.product"),
      links: [
        { href: "/academy", label: "Academy" },
        { href: "/chat", label: "AI Assistant" },
        { href: "/business", label: "Business AI" },
        { href: "/automation", label: "Automation" },
        { href: "/tools", label: "AI Tools" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("footer.about") },
        { href: "/careers", label: t("footer.careers") },
        { href: "/partners", label: t("footer.partners") },
        { href: "/contact", label: t("footer.contact") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/privacy", label: t("footer.privacy") },
        { href: "/terms", label: t("footer.terms") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background/60">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/lemessa-ahmed-765476332"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn — Lemessa Ahmed"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/lemessaA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub — lemessaA"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/lemikind"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) — @lemikind"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {sections.map((s) => (
              <div key={s.title}>
                <h4 className="font-display text-sm font-semibold tracking-tight">{s.title}</h4>
                <ul className="mt-4 space-y-2">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>{t("footer.copyright", { year })}</span>
          <span>Made with care in the Horn of Africa.</span>
        </div>
      </div>
    </footer>
  );
}
