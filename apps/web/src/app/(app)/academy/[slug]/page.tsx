"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, GraduationCap, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Course } from "@/types";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [course, setCourse] = React.useState<Course | null>(null);
  const [enrolling, setEnrolling] = React.useState(false);
  const [enrolled, setEnrolled] = React.useState(false);

  React.useEffect(() => {
    if (!slug) return;
    api.get<Course>(`/courses/${slug}`).then(setCourse).catch(() => setCourse(null));
  }, [slug]);

  async function enroll() {
    if (!slug) return;
    setEnrolling(true);
    try {
      await api.post(`/courses/${slug}/enroll`);
      setEnrolled(true);
      toast.success("You're enrolled. Let's go!");
    } catch {
      toast.error("Couldn't enroll right now.");
    } finally {
      setEnrolling(false);
    }
  }

  if (!course) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href="/academy"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Academy
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <Badge variant="secondary" className="mb-3">
            {course.category}
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="mt-3 text-lg text-muted-foreground">{course.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {Math.round(course.duration_minutes / 60)}h
            </span>
            <span className="inline-flex items-center gap-1 capitalize">
              <GraduationCap className="h-4 w-4" /> {course.level}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {course.lessons.length} lessons
            </span>
          </div>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="font-display text-xl font-semibold">About this course</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {course.description}
              </p>
            </section>

            {course.learning_outcomes.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold">You'll learn</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {course.learning_outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-xl font-semibold">Curriculum</h2>
              <Card className="mt-3">
                <CardContent className="divide-y divide-border p-0">
                  {course.lessons.map((l, idx) => (
                    <div key={l.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {idx + 1}
                      </span>
                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{l.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {l.lesson_type} · {l.duration_minutes} min
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="overflow-hidden sticky top-20">
            <div className="aspect-video bg-gradient-to-br from-primary/30 via-plum/20 to-accent/30" />
            <CardContent className="p-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold">
                  {course.is_free ? "Free" : `$${course.price_cents / 100}`}
                </span>
                {!course.is_free && (
                  <span className="text-xs text-muted-foreground line-through">$49</span>
                )}
              </div>

              {enrolled ? (
                <>
                  <p className="text-sm text-success font-medium">You're enrolled ✓</p>
                  <Progress value={0} />
                  <Button variant="gradient" className="w-full" size="lg">
                    Start lesson 1
                  </Button>
                </>
              ) : (
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={enroll}
                  disabled={enrolling}
                >
                  Enroll for free
                </Button>
              )}

              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <p>✓ Lifetime access</p>
                <p>✓ Certificate of completion</p>
                <p>✓ Mobile-friendly</p>
                <p>✓ Built for low bandwidth</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
