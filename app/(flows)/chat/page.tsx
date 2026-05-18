"use client";

import { HablaAiChat } from "@/components/habla-ai/habla-ai-chat";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export default function ChatPage() {
  const { m } = useMarketingCopy();
  const p = m.product;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <p className="eyebrow text-center">{p.chatEyebrow}</p>
      <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
        {p.chatTitleLine1}
        <span className="italic text-foreground/85">{p.chatTitleItalic}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-muted-foreground">{p.chatBody}</p>
      <div className="mt-10">
        <HablaAiChat />
      </div>
    </div>
  );
}
