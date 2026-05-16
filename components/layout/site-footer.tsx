import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Climate intelligence for the people who feed the world. Built for
            farmers, agronomists, and the cooperatives in between.
          </p>
        </div>
        <FooterColumn
          title="Product"
          links={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/#features", label: "Features" },
            { href: "/#science", label: "Methodology" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/#about", label: "About" },
            { href: "/#contact", label: "Contact" },
            { href: "/#privacy", label: "Privacy" },
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span className="eyebrow !text-[0.65rem]">
            © {new Date().getFullYear()} · Climatifai
          </span>
          <span className="numeric">v0.1 · scaffold</span>
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
