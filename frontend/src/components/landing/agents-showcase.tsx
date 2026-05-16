"use client";

import { motion } from "framer-motion";
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
  Zap,
} from "lucide-react";

const agents = [
  { name: "AI Teacher", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { name: "Business Consultant", icon: Briefcase, color: "bg-accent/10 text-accent" },
  { name: "Agriculture Advisor", icon: Sprout, color: "bg-success/15 text-success" },
  { name: "Marketing Assistant", icon: Megaphone, color: "bg-warning/15 text-warning" },
  { name: "Career Coach", icon: UserCheck, color: "bg-cobalt/15 text-cobalt" },
  { name: "Automation Expert", icon: Workflow, color: "bg-plum/15 text-plum" },
  { name: "Resume Builder", icon: GraduationCap, color: "bg-primary/10 text-primary" },
  { name: "AI Translator", icon: Languages, color: "bg-accent/10 text-accent" },
  { name: "Student Tutor", icon: BookOpen, color: "bg-success/15 text-success" },
  { name: "Startup Advisor", icon: LineChart, color: "bg-plum/15 text-plum" },
];

export function AgentsShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30 border-y border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/60 border border-border px-3 py-1 text-xs">
            <Zap className="h-3 w-3 text-accent" /> 10 specialised AI agents
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            One platform. Ten experts. Always-on.
          </h2>
          <p className="mt-4 text-muted-foreground">
            {
              "Each agent is fine-tuned with domain knowledge for African contexts — from teff farming to WhatsApp commerce. Powered by Groq's sub-second inference and orchestrated through LangGraph."
            }
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.color} group-hover:scale-110 transition-transform`}
              >
                <a.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-center">{a.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
