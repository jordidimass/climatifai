"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { MarketingCopy } from "@/lib/marketing-copy";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export type MarketingArticleSlug = keyof MarketingCopy["pages"];

export function MarketingArticle({ slug }: { slug: MarketingArticleSlug }) {
  const { m } = useMarketingCopy();
  const article = m.pages[slug];

  return (
    <article className="pb-24">
      <header className="pb-10">
        <p className="eyebrow text-muted-foreground">{article.eyebrow}</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-balance md:text-5xl">
          {article.title}
        </h1>
      </header>
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
        {article.paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
      {"anchorSections" in article &&
      Array.isArray(article.anchorSections) &&
      article.anchorSections.length ? (
        <div className="mt-16 space-y-12 border-t border-border/60 pt-12">
          {article.anchorSections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-[calc(var(--sticky-header-offset,90px)+0.5rem)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground">
                {sec.title}
              </h2>
              <p className="mt-3 text-muted-foreground md:text-[1.0625rem]">{sec.body}</p>
              {sec.href ? (
                <Link
                  href={sec.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {sec.linkLabel ?? sec.href}
                  <ArrowUpRight className="size-3.5 opacity-70" aria-hidden />
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </article>
  );
}
