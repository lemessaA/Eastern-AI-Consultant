"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Inbox,
  MessageSquare,
  Sparkles,
  Workflow,
} from "lucide-react";

import { AGENTS } from "@/components/chat/agent-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { AgentType, Conversation, PlanInfo } from "@/types";

interface ChatStats {
  conversations: number;
  messages: number;
  tokens: number;
}

interface SubscriptionInfo {
  plan: PlanInfo["plan"];
  status: string;
  current_period_end?: string | null;
}

interface EnrollmentWithCourse {
  id: string;
  course_id: string;
  progress_percent: number;
  completed_at: string | null;
  created_at: string;
  course: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    category: string;
    duration_minutes: number;
  } | null;
}

// Per-plan AI-message quotas used to draw the usage bars. These mirror the
// limits advertised on the marketing pricing page.
const QUOTAS: Record<PlanInfo["plan"], { messages: number; automations: number }> = {
  free: { messages: 100, automations: 1 },
  pro: { messages: 5000, automations: 10 },
  enterprise: { messages: 100000, automations: 100 },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.full_name?.split(" ")[0] ?? "Friend";

  const stats = useQuery<ChatStats>({
    queryKey: ["chat-stats"],
    queryFn: () => api.get<ChatStats>("/chat/stats"),
  });

  const conversations = useQuery<Conversation[]>({
    queryKey: ["recent-conversations"],
    queryFn: () => api.get<Conversation[]>("/chat/conversations?limit=4"),
  });

  const enrollments = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get<EnrollmentWithCourse[]>("/courses/me/enrollments"),
  });

  const subscription = useQuery<SubscriptionInfo>({
    queryKey: ["my-subscription"],
    queryFn: () => api.get<SubscriptionInfo>("/payments/subscription"),
  });

  const plan = subscription.data?.plan ?? "free";
  const quota = QUOTAS[plan] ?? QUOTAS.free;
  const automations = 0; // wired to /automation in the next pass

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
          <p className="text-sm text-muted-foreground">
            {t("dashboard.welcome", { name: firstName })}
          </p>
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
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${a.color} text-white`}
                >
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

      {/* Agents + usage */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.yourAgents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {AGENTS.slice(0, 8).map((agent) => (
                <Link
                  key={agent.key}
                  href={`/chat?agent=${agent.key}`}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <agent.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-center">{agent.name}</p>
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
            <UsageBar
              label="AI messages"
              value={stats.data?.messages ?? 0}
              max={quota.messages}
              loading={stats.isLoading}
            />
            <UsageBar
              label="Course enrollments"
              value={enrollments.data?.length ?? 0}
              max={8}
              loading={enrollments.isLoading}
            />
            <UsageBar
              label="Automations"
              value={automations}
              max={quota.automations}
              loading={false}
            />
            {plan === "free" ? (
              <Link href="/pricing" className="block">
                <Badge variant="gradient" className="w-full justify-center py-1.5 cursor-pointer">
                  Upgrade to Pro for unlimited
                </Badge>
              </Link>
            ) : (
              <Badge variant="success" className="w-full justify-center py-1.5">
                {plan.toUpperCase()} plan · {subscription.data?.status ?? "active"}
              </Badge>
            )}
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
            {conversations.isLoading ? (
              <DivideSkeleton rows={4} />
            ) : conversations.data && conversations.data.length > 0 ? (
              conversations.data.slice(0, 5).map((c) => {
                const agent = AGENTS.find((a) => a.key === (c.agent_type as AgentType));
                return (
                  <Link
                    key={c.id}
                    href={`/chat?conversation=${c.id}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 rounded-md px-2 -mx-2 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent?.name ?? "Assistant"} · {formatRelativeTime(c.updated_at)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                cta={{ href: "/chat", label: t("dashboard.startChat") }}
              />
            )}
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
            {enrollments.isLoading ? (
              <DivideSkeleton rows={3} />
            ) : enrollments.data && enrollments.data.length > 0 ? (
              enrollments.data.slice(0, 4).map((e) => (
                <Link
                  key={e.id}
                  href={e.course ? `/academy/${e.course.slug}` : "/academy"}
                  className="block space-y-2 rounded-md px-2 -mx-2 py-1 hover:bg-muted/40 transition"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">
                      {e.course?.title ?? "Course"}
                    </span>
                    <span className="text-muted-foreground shrink-0 ml-2">
                      {Math.round(e.progress_percent)}%
                    </span>
                  </div>
                  <Progress value={e.progress_percent} />
                </Link>
              ))
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No courses yet"
                cta={{ href: "/academy", label: "Browse academy" }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsageBar({
  label,
  value,
  max,
  loading,
}: {
  label: string;
  value: number;
  max: number;
  loading: boolean;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {loading ? "…" : `${value.toLocaleString()} / ${max.toLocaleString()}`}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

function DivideSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3 py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      {cta && (
        <Link href={cta.href}>
          <Button size="sm" variant="outline" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" /> {cta.label}
          </Button>
        </Link>
      )}
    </div>
  );
}

// Re-export so other pages can detect emptiness consistently.
export const _DashboardPrimitives = { Inbox, Bot };
