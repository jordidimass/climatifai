"use client";

import { GitCompare, Gauge, Sparkles } from "lucide-react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export function FeatureGrid() {
  const { m } = useMarketingCopy();
  const feats = [
    {
      icon: GitCompare,
      eyebrow: m.features.f1eyebrow,
      title: m.features.f1title,
      body: m.features.f1body,
    },
    {
      icon: Gauge,
      eyebrow: m.features.f2eyebrow,
      title: m.features.f2title,
      body: m.features.f2body,
    },
    {
      icon: Sparkles,
      eyebrow: m.features.f3eyebrow,
      title: m.features.f3title,
      body: m.features.f3body,
    },
  ];

  return (
    <section id="capacidades" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{m.features.sectionEyebrow}</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
          {m.features.sectionTitleBefore}{" "}
          <span className="italic text-foreground/80">
            {m.features.sectionTitleItalic}
          </span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {feats.map((f) => {
          const Icon = f.icon;
          return (
            <article
              key={f.title}
              className="glass group relative flex flex-col gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="eyebrow">{f.eyebrow}</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <div className="hairline mt-auto" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
