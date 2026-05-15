"use client";

import { Quote, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/utils";

const QUOTES = [
  {
    name: "Selamawit Tadesse",
    role: "Founder, Adama Coffee Co.",
    country: "🇪🇹 Adama",
    body: "I cancelled three apps after switching to Eastern AI. The Business Consultant gave us a 30-day plan that grew our WhatsApp orders by 38% in 6 weeks.",
    rating: 5,
  },
  {
    name: "Abdirahman Yusuf",
    role: "Agronomist",
    country: "🇸🇴 Hargeisa",
    body: "The Agriculture Advisor speaks Somali. My farmers can finally ask questions in their language and get answers that actually fit our climate.",
    rating: 5,
  },
  {
    name: "Caaltuu Hassan",
    role: "Computer Science student",
    country: "🇪🇹 Jigjiga",
    body: "I learned prompt engineering in one weekend with the AI Teacher. Three weeks later I landed a remote intern role. Life-changing.",
    rating: 5,
  },
  {
    name: "Dawit Bekele",
    role: "Marketing Manager",
    country: "🇪🇹 Addis Ababa",
    body: "We replaced our $1,200/mo agency with the Marketing Assistant. It writes better hooks in Amharic than our previous copywriters.",
    rating: 5,
  },
  {
    name: "Hodan Ahmed",
    role: "NGO Programme Lead",
    country: "🇸🇴 Mogadishu",
    body: "The automation workflows let our 4-person team behave like a 12-person team. WhatsApp lead capture alone saved us 9 hours a week.",
    rating: 5,
  },
  {
    name: "Lemma Tolosa",
    role: "Smallholder farmer",
    country: "🇪🇹 Nekemte",
    body: "I uploaded a photo of my coffee leaves and got an answer in Afaan Oromoo with three treatments. Worked. Saved my whole season.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Loved across the continent</h2>
          <p className="mt-4 text-muted-foreground">
            Real stories from students, entrepreneurs, and farmers in East Africa.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <Card key={q.name} className="card-hover h-full">
              <CardContent className="flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-primary/70" />
                <p className="mt-3 flex-1 text-sm leading-relaxed">{q.body}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar>
                    <AvatarFallback>{initials(q.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{q.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.role} · {q.country}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: q.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-warning fill-warning" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
