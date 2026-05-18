"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const { m } = useMarketingCopy();
  const c = m.cta;
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
            {c.title1}{" "}
            <span className="italic text-foreground/80">{c.title2Italic}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance text-muted-foreground">{c.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/advisor">
                {c.primarySowing}
                <ArrowUpRight className="ml-1 size-4" aria-hidden={true} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-background/60 px-6 backdrop-blur"
            >
              <Link href="/contact">{c.secondaryContact}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
