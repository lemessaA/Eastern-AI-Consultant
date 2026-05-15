"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Briefcase, MessageSquare, Sparkles, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.full_name?.split(" ")[0] ?? "Friend";

  const quickActions = [
    { icon: MessageSquare, label: "Open AI Chat", href: "/chat", color: "from-primary to-plum" },
    { icon: Briefcase, label: "Analyse Business", href: "/business", color: "from-accent to-warning" },
    { icon: BookOpen, label: "Continue learning", href: "/academy", color: "from-cobalt to-primary" },
    { icon: Workflow, label: "Build automation", href: "/automation", color: "from-plum to-accent" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("dashboard.welcome", { name: firstName })}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Let's build something with AI today.
          </h1>
        </div>
        <Link href="/chat">
          <Button variant="gradient" size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {t("dashboard.startChat")}
          </Button>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href}>
            <Card className="card-hover group h-full">
              <CardContent className="flex items-center gap-3 p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${a.color} text-white`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{a.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats + Agents + Courses */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.yourAgents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: "Teacher", icon: BookOpen },
                { name: "Business", icon: Briefcase },
                { name: "Marketing", icon: Sparkles },
                { name: "Automation", icon: Workflow },
                { name: "Career", icon: Bot },
                { name: "Agriculture", icon: BookOpen },
                { name: "Resume", icon: BookOpen },
                { name: "Translator", icon: BookOpen },
              ].map((agent) => (
                <Link
                  key={agent.name}
                  href={`/chat?agent=${agent.name.toLowerCase()}`}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <agent.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium">{agent.name}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">AI messages</span>
                <span className="font-medium">42 / 100</span>
              </div>
              <Progress value={42} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Course progress</span>
                <span className="font-medium">3 / 8</span>
              </div>
              <Progress value={37} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Automations</span>
                <span className="font-medium">2 active</span>
              </div>
              <Progress value={20} />
            </div>
            <Badge variant="gradient" className="w-full justify-center py-1.5">
              Upgrade to Pro for unlimited
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t("dashboard.recentChats")}</CardTitle>
            <Link href="/chat" className="text-xs text-primary hover:underline">
              See all
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {[
              { title: "How can I automate WhatsApp replies?", agent: "Automation", time: "2 hours ago" },
              { title: "Best crops for Adama in March", agent: "Agriculture", time: "Yesterday" },
              { title: "Write me a 30-day marketing plan", agent: "Marketing", time: "2 days ago" },
              { title: "Explain prompt engineering with examples", agent: "Teacher", time: "3 days ago" },
            ].map((c) => (
              <Link
                key={c.title}
                href="/chat"
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 rounded-md px-2 -mx-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.agent} · {c.time}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t("dashboard.myCourses")}</CardTitle>
            <Link href="/academy" className="text-xs text-primary hover:underline">
              Browse academy
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Prompt Engineering Masterclass", progress: 68 },
              { title: "AI for African Business Owners", progress: 42 },
              { title: "No-Code AI Automation", progress: 14 },
            ].map((c) => (
              <div key={c.title} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-muted-foreground">{c.progress}%</span>
                </div>
                <Progress value={c.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
