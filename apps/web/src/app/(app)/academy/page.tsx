"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, GraduationCap, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { CourseSummary, PaginatedResponse } from "@/types";

const CATEGORIES = [
  "All",
  "AI Fundamentals",
  "Prompt Engineering",
  "AI for Business",
  "AI for Agriculture",
  "AI for Marketing",
  "AI Automation",
  "AI Ethics",
  "AI Productivity",
];

export default function AcademyPage() {
  const [category, setCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [courses, setCourses] = React.useState<CourseSummary[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setCourses(null);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    params.set("page_size", "30");

    api
      .get<PaginatedResponse<CourseSummary>>(`/courses?${params.toString()}`)
      .then((res) => {
        if (!cancelled) setCourses(res.items);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [category, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Learning Academy</h1>
        <p className="text-muted-foreground mt-1">
          Practical, hands-on AI courses for African students and professionals.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={category === c ? "gradient" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
              className="shrink-0"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {courses === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No courses yet. Run the seed script to load 8 demo courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.id} href={`/academy/${c.slug}`}>
              <Card className="card-hover h-full overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/30 via-plum/20 to-accent/30" />
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary">{c.category}</Badge>
                    <span className="text-muted-foreground capitalize">{c.level}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{c.title}</h3>
                  {c.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.subtitle}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {Math.round(c.duration_minutes / 60)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" /> {c.rating.toFixed(1)} ({c.rating_count})
                    </span>
                    <span>{c.is_free ? "Free" : `$${c.price_cents / 100}`}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
