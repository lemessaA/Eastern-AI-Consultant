"use client";

import * as React from "react";
import { Activity, Clock, DollarSign, Plus, Sparkles, Workflow } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

interface Template {
  key: string;
  name: string;
  type: string;
  description: string;
  setup_minutes: number;
  monthly_cost_usd: number;
}

export default function AutomationPage() {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [context, setContext] = React.useState("");
  const [selected, setSelected] = React.useState<Template | null>(null);
  const [blueprint, setBlueprint] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);

  React.useEffect(() => {
    api.get<Template[]>("/automation/templates").then(setTemplates).catch(() => setTemplates([]));
  }, []);

  async function generate() {
    if (!selected || !context.trim()) return;
    setGenerating(true);
    setBlueprint(null);
    try {
      const out = await api.post<{ blueprint: string }>("/automation/templates/generate", {
        automation_type: selected.type,
        business_context: context,
        language: "en",
      });
      setBlueprint(out.blueprint);
      toast.success("Workflow blueprint ready.");
    } catch {
      toast.error("Could not generate workflow.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Automation Center</h1>
        <p className="text-muted-foreground mt-1">
          Pick a template, describe your business and let the Automation Expert agent design the
          workflow for you.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Templates</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {templates.map((t) => (
              <button
                key={t.key}
                onClick={() => setSelected(t)}
                className={`text-left rounded-xl border p-4 transition card-hover ${
                  selected?.key === t.key
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">{t.name}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t.setup_minutes}m
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />${t.monthly_cost_usd}/mo
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selected ? `Design: ${selected.name}` : "Pick a template"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={6}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the business and what you want the automation to do. E.g. 'A small coffee shop in Adama with 5 staff. We get 80 WhatsApp messages per day asking for menu, location, and to book tables.'"
                disabled={!selected}
              />
              <Button
                onClick={generate}
                variant="gradient"
                disabled={!selected || !context.trim() || generating}
                className="w-full"
              >
                {generating ? "Designing…" : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate workflow
                  </>
                )}
              </Button>
              {blueprint && (
                <div className="markdown-body rounded-lg border border-border bg-muted/30 p-4 text-sm max-h-96 overflow-y-auto scrollbar-thin">
                  <pre className="whitespace-pre-wrap font-sans">{blueprint}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active automations</CardTitle>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3.5 w-3.5" /> New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "WhatsApp FAQ Bot", status: "active", runs: 1240 },
                  { name: "Daily social post", status: "active", runs: 31 },
                ].map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {a.runs} runs / month
                      </p>
                    </div>
                    <Badge variant="success">{a.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
