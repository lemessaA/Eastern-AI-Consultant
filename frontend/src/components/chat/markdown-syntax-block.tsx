"use client";

import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Prism + themes load only when a fenced code block is rendered (~large dependency). */
export function MarkdownSyntaxFence({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between rounded-t-lg bg-muted/80 px-3 py-1.5 text-xs">
        <span className="text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {}
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          fontSize: 13,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
