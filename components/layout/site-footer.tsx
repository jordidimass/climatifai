"use client";

import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export function SiteFooter() {
  const { m } = useMarketingCopy();
  const f = m.footer;
  const h = m.header;

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">{f.blurb}</p>
        </div>
        <FooterColumn
          title={f.columnProduct}
          links={[
            { href: "/analizar-siembra", label: f.linkAnalyze },
            { href: "/mapa-incendios", label: f.linkMap },
            { href: "/habla-ai", label: f.linkAi },
            { href: "/insights", label: f.linkInsights },
            { href: "/#capacidades", label: f.linkFeatures },
          ]}
        />
        <FooterColumn
          title={f.columnSite}
          links={[
            { href: "/#por-que", label: h.navWhy },
            { href: "/#empresas", label: h.navBusiness },
            { href: "/#contact", label: f.linkContact },
            { href: "/#privacy", label: f.linkPrivacy },
          ]}
        />
      </div>

      <div
        id="privacy"
        className="scroll-mt-28 border-t border-border/60 bg-muted/15"
      >
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <p className="eyebrow mb-2 text-foreground/80">{f.dataSourcesEyebrow}</p>
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground md:text-[0.8125rem]">
            {f.dataSourcesBody}
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span className="eyebrow !text-[0.65rem]">
            © {new Date().getFullYear()} {f.copyrightSuffix}
          </span>
          <span className="numeric">{f.versionStub}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-3 text-foreground/80">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={`${l.href}-${l.label}`}>
            <Link
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
