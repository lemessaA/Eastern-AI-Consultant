"use client";

import * as React from "react";
import { FileText, Loader2, Mail, MessageCircle, Target } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

export default function CareerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Career Coach</h1>
        <p className="text-muted-foreground mt-1">
          ATS resumes, cover letters, interview prep and skill roadmaps — tuned for African talent
          targeting remote and global roles.
        </p>
      </div>

      <Tabs defaultValue="resume">
        <TabsList>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="cover">Cover letter</TabsTrigger>
          <TabsTrigger value="interview">Interview sim</TabsTrigger>
          <TabsTrigger value="skills">Skill plan</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="mt-6">
          <ResumeBuilder />
        </TabsContent>
        <TabsContent value="cover" className="mt-6">
          <CoverLetter />
        </TabsContent>
        <TabsContent value="interview" className="mt-6">
          <InterviewSim />
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          <SkillPlan />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GenericForm({
  endpoint,
  fields,
  resultKey,
  buttonLabel,
  icon: Icon,
  title,
}: {
  endpoint: string;
  fields: { name: string; label: string; type?: "text" | "textarea"; placeholder?: string; required?: boolean }[];
  resultKey: string;
  buttonLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setResult(null);
    const body: Record<string, unknown> = { language: "en" };
    fields.forEach((f) => {
      const v = String(fd.get(f.name) || "");
      if (f.name === "skills" || f.name === "current_skills") {
        body[f.name] = v.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        body[f.name] = v;
      }
    });
    try {
      const out = await api.post<Record<string, string>>(endpoint, body);
      setResult(out[resultKey]);
    } catch {
      toast.error("AI service unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-2">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  name={f.name}
                  required={f.required}
                  rows={5}
                  placeholder={f.placeholder}
                />
              ) : (
                <Input id={f.name} name={f.name} required={f.required} placeholder={f.placeholder} />
              )}
            </div>
          ))}
          <Button type="submit" variant="gradient" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonLabel}
          </Button>
        </form>
        {result && (
          <div className="mt-6 markdown-body rounded-lg border border-border bg-muted/30 p-4 text-sm max-h-[600px] overflow-y-auto scrollbar-thin">
            <pre className="whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResumeBuilder() {
  return (
    <GenericForm
      icon={FileText}
      title="ATS-friendly resume"
      endpoint="/career/resume"
      buttonLabel="Generate resume"
      resultKey="resume_markdown"
      fields={[
        { name: "target_role", label: "Target role", required: true, placeholder: "Junior Data Analyst — Remote" },
        { name: "experience_summary", label: "Your experience", type: "textarea", required: true, placeholder: "2 years as a sales analyst at a coffee export firm…" },
        { name: "skills", label: "Skills (comma-separated)", placeholder: "Python, SQL, Tableau, Amharic, English" },
        { name: "job_description", label: "Job description (optional)", type: "textarea", placeholder: "Paste the JD here for keyword-targeted output" },
      ]}
    />
  );
}

function CoverLetter() {
  return (
    <GenericForm
      icon={Mail}
      title="Cover letter"
      endpoint="/career/cover-letter"
      buttonLabel="Generate letter"
      resultKey="cover_letter"
      fields={[
        { name: "job_description", label: "Job description", type: "textarea", required: true },
        { name: "candidate_summary", label: "Your background", type: "textarea", required: true },
        { name: "tone", label: "Tone", placeholder: "professional / warm / direct" },
      ]}
    />
  );
}

function InterviewSim() {
  return (
    <GenericForm
      icon={MessageCircle}
      title="Interview simulation"
      endpoint="/career/interview-sim"
      buttonLabel="Run simulation"
      resultKey="interview_pack"
      fields={[
        { name: "role", label: "Role", required: true, placeholder: "Frontend Engineer" },
        { name: "seniority", label: "Seniority", placeholder: "junior / mid / senior" },
        { name: "focus", label: "Focus", placeholder: "behavioural / technical / system design" },
      ]}
    />
  );
}

function SkillPlan() {
  return (
    <GenericForm
      icon={Target}
      title="Skill assessment & roadmap"
      endpoint="/career/skill-assessment"
      buttonLabel="Generate roadmap"
      resultKey="plan"
      fields={[
        { name: "career_goal", label: "Career goal", required: true, placeholder: "Become a remote AI engineer in 12 months" },
        { name: "current_skills", label: "Current skills (comma-separated)", required: true, placeholder: "Python, Excel, marketing basics" },
        { name: "horizon_months", label: "Horizon (months)", placeholder: "12" },
      ]}
    />
  );
}
