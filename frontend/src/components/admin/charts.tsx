"use client";

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

import { Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["hsl(258 90% 56%)", "hsl(24 95% 53%)", "hsl(189 94% 43%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)"];

export interface AdminChartsProps {
  langData: { name: string; value: number }[];
  roleData: { name: string; value: number }[];
}

/** Recharts bundles are deferred until the admin metrics page loads. */
export function AdminCharts({ langData, roleData }: AdminChartsProps) {
  return (
    <>
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
          <a
            href="/admin/announcements"
            className="rounded-lg border border-border p-4 hover:bg-muted/40 transition"
          >
            Send announcement
          </a>
        </CardContent>
      </Card>
    </>
  );
}
