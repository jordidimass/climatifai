import type { Metadata } from "next";

import { AnalizarSiembraForm } from "@/components/forms/analizar-siembra-form";
import { FlowHeader } from "@/components/layout/flow-header";

export const metadata: Metadata = {
  title: "Analizar siembra",
};

export default function AnalizarSiembraPage() {
  return (
    <>
      <FlowHeader title="Analizar tu siembra" />
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <p className="eyebrow text-center">Preparar cosecha</p>
        <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
          Ubicación, tipo y fecha
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted-foreground">
          Ajusta los datos de tu siembra y abre el panel de lecturas climáticas
          para esa combinación.
        </p>
        <div className="mx-auto mt-10 max-w-lg">
          <AnalizarSiembraForm />
        </div>
      </div>
    </>
  );
}
