"use client";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { InsightsAnimatedHero } from "./_components/insights-animated-hero";
import { InsightsChat } from "./_components/insights-chat";

export default function InsightsPage() {
  const { m } = useMarketingCopy();
  const p = m.product;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-10">
      <InsightsAnimatedHero eyebrow={p.insightsEyebrow} title={p.insightsTitle} description={p.insightsIntro} />
      <InsightsChat />
    </div>
  );
}
