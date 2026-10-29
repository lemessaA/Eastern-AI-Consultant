"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, disabled, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=on]:bg-primary data-[state=off]:bg-muted",
          className,
        )}
        role="switch"
        aria-checked={pressed}
        aria-disabled={disabled}
        onClick={() => onPressedChange?.(!pressed)}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            "data-[state=on]:translate-x-5 data-[state=off]:translate-x-0",
          )}
        />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";