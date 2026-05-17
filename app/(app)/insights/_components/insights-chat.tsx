"use client";

import {
  DefaultChatTransport,
  generateId,
  readUIMessageStream,
  type UIMessage,
} from "ai";
import { Loader2, SendHorizontal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSelectionStore } from "@/stores/selection-store";
import { cn } from "@/lib/utils";

function messageText(m: UIMessage): string {
  return m.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof (p as { text?: string }).text === "string",
    )
    .map((p) => p.text)
    .join("");
}

export function InsightsChat() {
  const region = useSelectionStore((s) => s.region);
  const crop = useSelectionStore((s) => s.crop);
  const compareCrop = useSelectionStore((s) => s.compareCrop);
  const comparisonMode = useSelectionStore((s) => s.comparisonMode);
  /** Solo paralelizamos cuando el modo comparación está encendido (p. ej. desde /dashboard/compare). */
  const compareActive =
    comparisonMode &&
    compareCrop.id !== crop.id &&
    !!compareCrop.name?.trim();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
      }),
    [],
  );

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const toastedRef = useRef(false);

  useEffect(() => {
    if (!error) toastedRef.current = false;
    if (error && !toastedRef.current) {
      toastedRef.current = true;
      toast.error("Asistente", {
        description:
          "No pudimos obtener respuesta. Comprueba tu conexión o AI_GATEWAY_API_KEY.",
      });
    }
  }, [error]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;

    const userMsg: UIMessage = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text }],
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setDraft("");
    setBusy(true);
    setError(false);

    const contextPayload = {
      regionId: region.id,
      regionName: region.name,
      cropId: crop.id,
      cropName: crop.name,
      regionSummary: region.summary,
      ...(compareActive && {
        compareCropId: compareCrop.id,
        compareCropName: compareCrop.name,
      }),
    };

    try {
      const stream = await transport.sendMessages({
        trigger: "submit-message",
        chatId: "insights",
        messageId: undefined,
        messages: history,
        abortSignal: undefined,
        body: { context: contextPayload },
      });

      let lastAssistant: UIMessage | undefined;
      for await (const partial of readUIMessageStream({ stream })) {
        lastAssistant = partial;
        setMessages([...history, partial]);
      }
      if (!lastAssistant) {
        setError(true);
      }
    } catch {
      setError(true);
      setMessages(history);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      className={cn(
        "glass cf-insights-card-wrap min-h-[28rem] border-border/80",
        "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary ring-2 ring-primary/30",
              "cf-insights-spark-icon",
            )}
          >
            <Sparkles className="size-5" aria-hidden />
          </div>
          <div>
            <CardTitle className="font-heading text-lg">Hallazgos</CardTitle>
            <CardDescription>
              Preguntá en castellano. El modelo recibe la región y el cultivo del
              panel lateral.
              {compareActive
                ? " Con el modo comparación activo, también el segundo cultivo para contrastarlos."
                : null}
            </CardDescription>
          </div>
        </div>
        <p
          className={cn(
            "relative mt-3 overflow-hidden rounded-lg px-3 py-2 text-xs leading-relaxed text-muted-foreground",
            "ring-1 ring-border/55 cf-insights-context-shine md:px-4",
          )}
        >
            <span className="relative z-[1]">
              <span className="font-medium text-foreground/90">{region.name}</span>
              {" · "}
              <span className="font-medium text-foreground/90">{crop.name}</span>
              {compareActive ? (
                <>
                  <span className="mx-2 text-border">→</span>
                  <span className="font-medium text-primary/95">
                    {compareCrop.name}
                  </span>
                  <span className="mx-2 text-[0.6rem] font-normal uppercase text-muted-foreground">
                    comparativo
                  </span>
                </>
              ) : null}
              <span className="mx-2 text-border">|</span>
              {region.summary}
            </span>
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        <div
          className="flex max-h-[min(420px,50vh)] flex-col gap-3 overflow-y-auto pr-1"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <p
              className={cn(
                "rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground",
                "cf-insights-hint-breathe motion-reduce:animate-none",
              )}
            >
              Ejemplo:
              {compareActive
                ? " “¿Qué cultivo conviene ante sequía próxima, teniendo estos dos seleccionados?”"
                : " “¿Qué riesgos térmicos tiene este cultivo aquí en los próximos años?”"}
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "cf-insights-msg-in motion-reduce:animate-none max-w-[95%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ring-1",
                m.role === "user"
                  ? "ml-auto bg-primary/15 text-foreground ring-primary/20"
                  : "mr-auto bg-card/90 text-card-foreground ring-border/80",
              )}
            >
              <p className="eyebrow mb-1 text-[0.55rem] text-muted-foreground">
                {m.role === "user" ? "Tú" : "Climatifai"}
              </p>
              <p className="whitespace-pre-wrap">{messageText(m)}</p>
            </div>
          ))}
        </div>

        {error ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            No pudimos obtener respuesta. Intenta de nuevo en un momento.
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-muted/20 pt-4">
        <form
          className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={onSubmit}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribe tu pregunta…"
            disabled={busy}
            className="sm:flex-1"
            aria-label="Mensaje para el asistente"
          />
          <Button
            type="submit"
            disabled={busy || !draft.trim()}
            className="shrink-0 motion-safe:transition-transform motion-safe:active:scale-[0.97] motion-reduce:active:scale-100"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <SendHorizontal className="size-4" aria-hidden />
            )}
            Enviar
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
