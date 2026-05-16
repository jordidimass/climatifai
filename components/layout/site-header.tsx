"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/#por-que", label: "Por qué" },
  { href: "/#capacidades", label: "Capacidades" },
  { href: "/#empresas", label: "Empresas" },
] as const;

const FLOWS = [
  { href: "/habla-ai", label: "Habla AI" },
  { href: "/analizar-siembra", label: "Analizar siembra" },
  { href: "/mapa-incendios", label: "Mapa de incendios" },
] as const;

export function SiteHeader() {
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
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,22rem)]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
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
