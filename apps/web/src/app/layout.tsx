import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Eastern AI Consultant";

export const metadata: Metadata = {
  title: {
    default: `${appName} — Learn AI. Automate Business. Build the Future.`,
    template: `%s · ${appName}`,
  },
  description:
    "Multilingual AI education, business consulting and automation platform built for Eastern Ethiopia & Africa. Multi-agent assistants, an AI academy, and a complete business AI consulting workspace.",
  keywords: [
    "AI",
    "Ethiopia",
    "Africa",
    "Eastern AI",
    "AI consultant",
    "AI courses",
    "LangChain",
    "LangGraph",
    "Groq",
    "Amharic AI",
    "Afaan Oromo AI",
    "Somali AI",
  ],
  authors: [{ name: "Eastern AI Consultant" }],
  openGraph: {
    title: `${appName} — Learn AI. Automate Business. Build the Future.`,
    description:
      "Multilingual AI for African builders. Eight specialist agents, a learning academy, business consulting and automation in one platform.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
