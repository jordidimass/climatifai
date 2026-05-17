"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";

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

const FLOW_SUBROWS: Record<
  string,
  { backHref: string; titleKey: "subResultado" | "subMapSelection" }
> = {
  "/analizar-siembra/resultado": {
    backHref: "/analizar-siembra",
    titleKey: "subResultado",
  },
  "/mapa-incendios/seleccion": {
    backHref: "/mapa-incendios",
    titleKey: "subMapSelection",
  },
};

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

function primaryNavActive(pathname: string, href: string) {
  if (href === "/habla-ai") return pathname === "/habla-ai";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { m } = useMarketingCopy();
  const header = m.header;
  const footer = m.footer;

  const PRIMARY = [
    { href: "/analizar-siembra", label: header.flowAnalyze },
    { href: "/mapa-incendios", label: header.flowMap },
    { href: "/habla-ai", label: header.flowAi },
  ] as const;

  const SHEET_SECONDARY = [
    { href: "/", label: header.navHome },
    { href: "/#por-que", label: header.navWhy },
    { href: "/#capacidades", label: header.navFeatures },
    { href: "/#empresas", label: header.navBusiness },
    { href: "/insights", label: footer.linkInsights },
  ] as const;

  const subMeta = FLOW_SUBROWS[pathname];
  const subTitle = subMeta
    ? subMeta.titleKey === "subResultado"
      ? header.subResultado
      : header.subMapSelection
    : undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-3 md:h-16 md:gap-4">
          <div className="flex min-w-0 shrink-0 items-center">
            <Logo className="text-[1.15rem]" />
          </div>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-0.5 lg:flex lg:flex-1 lg:justify-center"
          >
            {PRIMARY.map((item) => {
              const active = primaryNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent/45 text-foreground"
                      : "text-muted-foreground hover:bg-accent/25 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <LangToggle />
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
                  <p className="eyebrow px-3 pb-1 pt-2 text-[0.65rem] text-muted-foreground">
                    {footer.columnProduct}
                  </p>
                  {PRIMARY.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <hr className="my-3 border-border/60" />
                  <p className="eyebrow px-3 pb-1 text-[0.65rem] text-muted-foreground">
                    {footer.columnSite}
                  </p>
                  {SHEET_SECONDARY.map((item) => (
                    <SheetClose asChild key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
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

        {subMeta ? (
          <div className="flex items-center gap-2 border-t border-border/40 py-2 md:py-2.5">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full" asChild>
              <Link href={subMeta.backHref} aria-label={header.backLabel}>
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
            <p className="min-w-0 truncate font-[family-name:var(--font-display)] text-base tracking-tight text-foreground md:text-lg">
              {subTitle}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
