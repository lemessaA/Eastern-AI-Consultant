"use client";

import Image from "next/image";

import { marketingImages } from "@/lib/marketing-images";

/** Compact image strip on auth pages (mobile / tablet where the side panel is hidden). */
export function AuthMobileBanner() {
  return (
    <div className="relative mb-8 h-40 overflow-hidden rounded-2xl lg:hidden">
      <Image
        src={marketingImages.auth.primary}
        alt=""
        fill
        className="object-cover object-[center_30%]"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute bottom-3 left-4 right-4">
        <p className="font-display text-lg font-semibold text-foreground">Eastern AI Consultant</p>
        <p className="text-xs text-muted-foreground">AI learning & business for Africa</p>
      </div>
    </div>
  );
}
