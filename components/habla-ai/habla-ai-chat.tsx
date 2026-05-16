"use client";

import { useMemo, useState } from "react";
import {
  DefaultChatTransport,
  generateId,
  readUIMessageStream,
  type UIMessage,
} from "ai";

import { Button } from "@/components/ui/button";
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

export function HablaAiChat() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
      }),
    [],
  );

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: UIMessage = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text }],
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const stream = await transport.sendMessages({
        trigger: "submit-message",
        chatId: "habla-ai-mvp",
        messageId: undefined,
        messages: history,
        abortSignal: undefined,
      });

      let lastAssistant: UIMessage | undefined;
      for await (const partial of readUIMessageStream({ stream })) {
        lastAssistant = partial;
        setMessages([...history, partial]);
      }
      if (!lastAssistant) {
        setError("No hubo respuesta del modelo.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar la IA.");
      setMessages(history);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {messages.length > 0 ? (
        <ul className="glass max-h-[min(40vh,420px)] space-y-4 overflow-y-auto rounded-2xl p-5">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "text-sm leading-relaxed",
                m.role === "user" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="eyebrow block text-[0.65rem] text-foreground/70">
                {m.role === "user" ? "Tú" : "Climatifai"}
              </span>
              <p className="mt-1 whitespace-pre-wrap">{messageText(m)}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="habla-ai-input" className="eyebrow">
          Tu mensaje
        </label>
        <textarea
          id="habla-ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="Ej.: Quiero planificar la cosecha de soya en Misiones considerando olas de calor…"
          className={cn(
            "min-h-[140px] w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-base outline-none transition-colors",
            "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:opacity-50 md:text-sm dark:bg-input/30",
          )}
          disabled={busy}
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-full"
          disabled={busy || !input.trim()}
        >
          {busy ? "Generando…" : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
