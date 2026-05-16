import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Inteligencia climática para quienes alimentan al mundo. Hecho para
            productores, agrónomos y cooperativas de Latinoamérica.
          </p>
        </div>
        <FooterColumn
          title="Producto"
          links={[
            { href: "/analizar-siembra", label: "Analizar siembra" },
            { href: "/mapa-incendios", label: "Mapa de incendios" },
            { href: "/habla-ai", label: "Habla AI" },
            { href: "/#capacidades", label: "Capacidades" },
          ]}
        />
        <FooterColumn
          title="Compañía"
          links={[
            { href: "/#about", label: "Acerca de" },
            { href: "/#contact", label: "Contacto" },
            { href: "/#privacy", label: "Privacidad" },
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span className="eyebrow !text-[0.65rem]">
            © {new Date().getFullYear()} · Climatifai
          </span>
          <span className="numeric">v0.1 · base inicial</span>
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
