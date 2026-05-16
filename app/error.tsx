"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error no controlado", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow">Algo falló</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight">
        Turbulencia inesperada.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        La página encontró un error. Inténtalo de nuevo o vuelve al inicio.
      </p>
      <p className="numeric mt-4 text-[10px] text-muted-foreground/70">
        {error.digest ? `ref: ${error.digest}` : null}
      </p>
      <Button onClick={reset} className="mt-6 rounded-full">
        Intentar de nuevo
      </Button>
    </div>
  );
}
