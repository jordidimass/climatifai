import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#science", label: "Science" },
  { href: "/#enterprise", label: "Enterprise" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="glass flex w-full items-center justify-between gap-6 rounded-full px-4 py-2">
          <Logo />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild size="sm" className="ml-1 rounded-full">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
