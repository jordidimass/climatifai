"use client";

import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";

export function SiteFooter() {
  const { m } = useMarketingCopy();
  const f = m.footer;

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
            { href: "/#capacidades", label: f.linkFeatures },
          ]}
        />
        <FooterColumn
          title={f.columnCompany}
          links={[
            { href: "/#about", label: f.linkAbout },
            { href: "/#contact", label: f.linkContact },
            { href: "/#privacy", label: f.linkPrivacy },
          ]}
        />
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
          <li key={l.href}>
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
