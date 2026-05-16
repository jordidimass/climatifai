import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow">404 · no encontrado</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-tight">
        Fuera del mapa.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Esa coordenada todavía no lleva a ningún lugar. Vuelve a una región conocida.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
