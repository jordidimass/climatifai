"use client";

import { AdvisorForm } from "@/components/forms/advisor-form";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export default function AdvisorPage() {
  const { m } = useMarketingCopy();
  const p = m.product;

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <p className="eyebrow text-center">{p.advisorPrepareEyebrow}</p>
      <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
        {p.advisorFlowTitle}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">{p.advisorFlowSub}</p>
      <div className="mx-auto mt-10 max-w-5xl">
        <AdvisorForm />
      </div>
    </div>
  );
}
