"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { BookOpen, MessageSquare, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminChartsProps } from "@/components/admin/charts";
import { api } from "@/lib/api";

interface Stats {
  users: number;
  new_users_7d: number;
  conversations: number;
  messages: number;
  enrollments: number;
  languages: Record<string, number>;
  roles: Record<string, number>;
}

const AdminCharts = dynamic(() => import("@/components/admin/charts").then((m) => ({ default: m.AdminCharts })), {
  loading: () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[22rem] animate-pulse rounded-xl bg-muted/40 ring-1 ring-border/50" aria-hidden />
        <div className="h-[22rem] animate-pulse rounded-xl bg-muted/40 ring-1 ring-border/50" aria-hidden />
      </div>
      <div className="h-40 animate-pulse rounded-xl bg-muted/40 ring-1 ring-border/50" aria-hidden />
    </div>
  ),
  ssr: false,
});

export default function AdminPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    api.get<Stats>("/admin/stats").then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <p className="text-muted-foreground">Loading admin metrics…</p>;
  }

  const langData: AdminChartsProps["langData"] = Object.entries(stats.languages).map(([name, value]) => ({
    name,
    value,
  }));
  const roleData: AdminChartsProps["roleData"] = Object.entries(stats.roles).map(([name, value]) => ({
    name,
    value,
  }));

  const tiles = [
    { label: "Users", value: stats.users, icon: Users },
    { label: "New users (7d)", value: stats.new_users_7d, icon: TrendingUp },
    { label: "Conversations", value: stats.conversations, icon: MessageSquare },
    { label: "AI messages", value: stats.messages, icon: MessageSquare },
    { label: "Enrollments", value: stats.enrollments, icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform-wide analytics and moderation.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <t.icon className="h-4 w-4" />
                {t.label}
              </div>
              <div className="mt-2 font-display text-3xl font-bold">{t.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminCharts langData={langData} roleData={roleData} />
    </div>
  );
}
