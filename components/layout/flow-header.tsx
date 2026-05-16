"use client";

import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";

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

const FLOW_LINKS = [
  { href: "/habla-ai", label: "Habla AI" },
  { href: "/analizar-siembra", label: "Analizar siembra" },
  { href: "/mapa-incendios", label: "Mapa de incendios" },
] as const;

export function FlowHeader({
  title,
  backHref,
  backLabel = "Volver",
}: {
  title?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <Logo className="text-[1.15rem]" />
          {backHref && backHref !== "/" ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link href={backHref} aria-label={backLabel}>
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>

        {title ? (
          <h1 className="min-w-0 flex-1 truncate text-center font-[family-name:var(--font-display)] text-lg tracking-tight md:text-xl">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
              </SheetHeader>
              <nav aria-label="Flujos MVP" className="flex flex-col gap-1 p-2">
                {FLOW_LINKS.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/#por-que"
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  >
                    Por qué Climatifai
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-full md:inline-flex"
            asChild
          >
            <Link href="/">Inicio</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
