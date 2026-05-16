"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownFenceLoading() {
  return (
    <div className="my-4 h-36 animate-pulse rounded-lg bg-muted/50 ring-1 ring-border/60" aria-hidden />
  );
}

const MarkdownSyntaxFence = dynamic(
  () =>
    import("@/components/chat/markdown-syntax-block").then((mod) => ({ default: mod.MarkdownSyntaxFence })),
  { ssr: false, loading: MarkdownFenceLoading },
);

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const text = String(children).replace(/\n$/, "");
            if (!inline && match) {
              return <MarkdownSyntaxFence language={match[1]} code={text} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noreferrer noopener">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
