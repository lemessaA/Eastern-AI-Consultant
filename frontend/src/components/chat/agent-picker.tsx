"use client";

import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Languages,
  LineChart,
  Megaphone,
  Sprout,
  UserCheck,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AgentType } from "@/types";

export interface AgentDef {
  key: AgentType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AGENTS: AgentDef[] = [
  { key: "teacher", name: "AI Teacher", description: "AI fundamentals, prompts, tutorials", icon: BookOpen },
  { key: "business_consultant", name: "Business", description: "Strategy, SWOT, growth", icon: Briefcase },
  { key: "agriculture", name: "Agriculture", description: "Crops, weather, pests", icon: Sprout },
  { key: "marketing", name: "Marketing", description: "Content, ads, brand", icon: Megaphone },
  { key: "career_coach", name: "Career", description: "Resume, interviews, skills", icon: UserCheck },
  { key: "automation", name: "Automation", description: "WhatsApp, email, no-code", icon: Workflow },
  { key: "resume_builder", name: "Resume", description: "ATS resumes & cover letters", icon: GraduationCap },
  { key: "translator", name: "Translator", description: "EN ↔ AM ↔ OM ↔ SO", icon: Languages },
  { key: "student_tutor", name: "Tutor", description: "Homework & exam prep", icon: BookOpen },
  { key: "startup_advisor", name: "Startup", description: "Pitch, MVP, fundraising", icon: LineChart },
];

export function AgentPicker({
  value,
  onChange,
  className,
}: {
  value: AgentType;
  onChange: (a: AgentType) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Specialists
      </p>
      <ul className="space-y-0.5">
        {AGENTS.map((a) => {
          const active = a.key === value;
          return (
            <li key={a.key}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(a.key)}
                className={cn(
                  "w-full justify-start gap-3 px-2 py-2 h-auto",
                  active && "bg-primary/10 text-primary",
                )}
              >
                <a.icon className="h-4 w-4 shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium leading-tight">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{a.description}</p>
                </div>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
