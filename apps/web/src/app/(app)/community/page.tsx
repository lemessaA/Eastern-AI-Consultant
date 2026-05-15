"use client";

import * as React from "react";
import { Loader2, MessageCircle, Plus, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { formatRelativeTime, initials } from "@/lib/utils";
import type { PaginatedResponse } from "@/types";

interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  tags: string[];
  views: number;
  upvotes: number;
  is_answered: boolean;
  author: { id: string; full_name: string; avatar_url: string | null };
  created_at: string;
  comment_count: number;
}

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  async function load() {
    try {
      const data = await api.get<PaginatedResponse<Post>>("/community/posts?page_size=30");
      setPosts(data.items);
    } catch {
      setPosts([]);
    }
  }
  React.useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreating(true);
    try {
      await api.post("/community/posts", {
        title: String(fd.get("title")),
        body: String(fd.get("body")),
        category: String(fd.get("category") || "general"),
        tags: [],
      });
      toast.success("Post published.");
      setOpen(false);
      load();
    } catch {
      toast.error("Could not publish.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground mt-1">
            Share, ask, and learn from other African builders.
          </p>
        </div>
        <Button onClick={() => setOpen((v) => !v)} variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      {open && (
        <Card>
          <CardHeader>
            <CardTitle>Start a discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="How are you using AI in your business?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue="general" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea id="body" name="body" required rows={6} />
              </div>
              <Button type="submit" variant="gradient" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {posts === null ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          Be the first to start a discussion!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="card-hover">
              <CardContent className="flex gap-4 p-5">
                <Avatar>
                  <AvatarFallback>{initials(p.author.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{p.author.full_name}</p>
                    <span className="text-xs text-muted-foreground">
                      · {formatRelativeTime(p.created_at)}
                    </span>
                    <Badge variant="secondary" className="ml-auto">{p.category}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.body}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" /> {p.upvotes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> {p.comment_count}
                    </span>
                    <span>{p.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
