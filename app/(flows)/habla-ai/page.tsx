import type { Metadata } from "next";

import { HablaAiChat } from "@/components/habla-ai/habla-ai-chat";
import { FlowHeader } from "@/components/layout/flow-header";

export const metadata: Metadata = {
  title: "Habla AI",
};

export default function HablaAiPage() {
  return (
    <>
      <FlowHeader title="Habla AI" />
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <p className="eyebrow text-center">Asistente agrícola</p>
        <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
          Describe lo que quieres{" "}
          <span className="italic text-foreground/85">cosechar</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-muted-foreground">
          Escribe tu objetivo: cultivo, región, fecha de siembra o preocupaciones
          climáticas. La IA responde con lecturas orientativas (no sustituye al
          agrónomo).
        </p>
        <div className="mt-10">
          <HablaAiChat />
        </div>
      </div>
    </>
  );
}
