"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { MarketingLocale } from "@/lib/marketing-copy";
import { useMarketingCopy } from "@/components/marketing/marketing-locale-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function LangToggle({ compact }: { compact?: boolean }) {
  const { locale, setLocale, m } = useMarketingCopy();
  const h = m.header;

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "flex items-center gap-px rounded-full border border-border/70 bg-muted/40 p-0.5 text-[0.7rem] font-semibold",
        compact && "scale-95",
      )}
    >
      {(["es", "en"] as const satisfies readonly MarketingLocale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "min-w-[2.05rem] rounded-full px-2 py-1 transition-colors",
            locale === code
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
          )}
          aria-pressed={locale === code}
        >
          {code === "es" ? h.langEs : h.langEn}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { m } = useMarketingCopy();
  const header = m.header;

  const NAV = [
    { href: "/#por-que", label: header.navWhy },
    { href: "/#capacidades", label: header.navFeatures },
    { href: "/#empresas", label: header.navBusiness },
  ] as const;

  const FLOWS = [
    { href: "/habla-ai", label: header.flowAi },
    { href: "/analizar-siembra", label: header.flowAnalyze },
    { href: "/mapa-incendios", label: header.flowMap },
  ] as const;

  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="glass flex w-full items-center justify-between gap-4 rounded-full px-4 py-2 md:gap-6">
          <Logo />
          <nav
            aria-label="Principal"
            className="hidden items-center gap-1 lg:flex"
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
          <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <LangToggle />
              {FLOWS.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link
                    href={item.href}
                    className="rounded-full text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="md:hidden">
              <LangToggle />
            </div>
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full lg:hidden"
                  aria-label={header.openMenu}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,22rem)]">
                <SheetHeader>
                  <SheetTitle>{header.mobileMenuTitle}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {header.languageLabel}
                  </span>
                  <LangToggle compact />
                </div>
                <nav
                  aria-label="Navegación móvil"
                  className="mt-4 flex flex-col gap-1"
                >
                  {NAV.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <hr className="my-2 border-border/60" />
                  {FLOWS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
