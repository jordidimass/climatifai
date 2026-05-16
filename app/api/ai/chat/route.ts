import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  CLIMATIFAI_SYSTEM_PROMPT,
  DEFAULT_MODEL_ID,
  gatewayClient,
} from "@/lib/ai/gateway";

export const maxDuration = 30;

type SelectionContextPayload = {
  regionId?: string;
  regionName?: string;
  cropId?: string;
  cropName?: string;
  regionSummary?: string;
};

function withSelectionContext(
  base: string,
  ctx?: SelectionContextPayload | null,
): string {
  if (
    !ctx ||
    (!ctx.regionName?.trim() && !ctx.cropName?.trim() && !ctx.regionSummary?.trim())
  ) {
    return base;
  }
  return `${base}

## Contexto seleccionado en la app (no inventes ubicaciones fuera de esto)
- Región: ${ctx.regionName ?? "—"} · id: ${ctx.regionId ?? "—"}
- Cultivo: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}
- Resumen de región disponible para el MVP: ${ctx.regionSummary ?? "—"}`;
}

export async function POST(request: Request) {
  let payload: {
    messages: UIMessage[];
    context?: SelectionContextPayload;
  };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "cuerpo JSON inválido" }, { status: 400 });
  }

  if (!Array.isArray(payload.messages)) {
    return Response.json(
      { error: "se esperaba { messages: UIMessage[] }" },
      { status: 400 },
    );
  }

  const messages = await convertToModelMessages(payload.messages);
  const system = withSelectionContext(
    CLIMATIFAI_SYSTEM_PROMPT,
    payload.context ?? undefined,
  );

  const result = streamText({
    model: gatewayClient(DEFAULT_MODEL_ID),
    system,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
