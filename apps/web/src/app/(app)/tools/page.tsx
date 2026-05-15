"use client";

import * as React from "react";
import { ExternalLink, Search, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

interface Tool {
  slug: string;
  name: string;
  category: string;
  pricing: string;
  beginner_friendly: boolean;
  rating: number;
  description: string;
  features: string[];
  url: string;
}

const CATEGORIES = ["all", "writing", "design", "coding", "marketing", "education", "video-editing", "productivity", "agriculture"];

export default function ToolsPage() {
  const [tools, setTools] = React.useState<Tool[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState("all");

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (search) params.set("search", search);
    api.get<Tool[]>(`/tools?${params.toString()}`).then(setTools).catch(() => setTools([]));
  }, [cat, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Tool Directory</h1>
        <p className="text-muted-foreground mt-1">
          A curated catalogue of the best AI tools — with realistic pricing, beginner-friendliness
          and direct links.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or use case…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={cat === c ? "gradient" : "outline"}
              size="sm"
              onClick={() => setCat(c)}
              className="shrink-0 capitalize"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {tools === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Card key={t.slug} className="card-hover h-full">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                  {t.beginner_friendly && (
                    <Badge variant="success" className="gap-1">
                      <Sparkles className="h-3 w-3" /> Beginner
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px]">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border text-sm">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-3.5 w-3.5 fill-warning" />
                    <span className="font-medium">{t.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{t.pricing}</span>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
