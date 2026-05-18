"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2, Handshake } from "lucide-react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { Button } from "@/components/ui/button";
import { CLIMATIFAI_API_DOCS_URL } from "@/lib/site-urls";

export function BuildSection() {
  const { m } = useMarketingCopy();
  const b = m.buildSection;

  return (
    <section id="para-construir" className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass relative overflow-hidden rounded-3xl px-8 py-14 md:px-14 md:py-18">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
            {b.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground md:text-lg">
            {b.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link
                href={CLIMATIFAI_API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Code2 className="size-4" aria-hidden />
                {b.ctaApi}
                <ArrowUpRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-background/60 px-6 backdrop-blur">
              <Link
                href={CLIMATIFAI_API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <BookOpen className="size-4" aria-hidden />
                {b.ctaDocs}
                <ArrowUpRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full px-6">
              <Link href="/build#contribute" className="gap-2">
                <Handshake className="size-4" aria-hidden />
                {b.ctaContribute}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

