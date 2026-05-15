"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpen, Briefcase, MessageSquare, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const COLORS = ["hsl(258 90% 56%)", "hsl(24 95% 53%)", "hsl(189 94% 43%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)"];

export default function AdminPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    api.get<Stats>("/admin/stats").then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <p className="text-muted-foreground">Loading admin metrics…</p>;
  }

  const langData = Object.entries(stats.languages).map(([name, value]) => ({ name, value }));
  const roleData = Object.entries(stats.roles).map(([name, value]) => ({ name, value }));

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by language</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={langData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {langData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(258 90% 56%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> Quick actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <a href="/admin/users" className="rounded-lg border border-border p-4 hover:bg-muted/40 transition">
            Manage users
          </a>
          <a href="/admin/courses" className="rounded-lg border border-border p-4 hover:bg-muted/40 transition">
            Manage courses
          </a>
          <a href="/admin/announcements" className="rounded-lg border border-border p-4 hover:bg-muted/40 transition">
            Send announcement
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
