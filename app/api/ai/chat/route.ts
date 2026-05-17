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
  compareCropId?: string;
  compareCropName?: string;
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
  let block = "";
  const dual =
    !!ctx.compareCropId?.trim() &&
    !!ctx.compareCropName?.trim() &&
    ctx.compareCropId !== ctx.cropId;

  if (dual) {
    block = `
## Cultivo principal
- Cultivo actual: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}

## Cultivo comparado
- Comparar con: ${ctx.compareCropName ?? "—"} · id: ${ctx.compareCropId ?? "—"}
- Respondé situaciones contrastando aptitudes, ventanas agronómicas y riesgos entre **ambos** cultivos dentro de esta región. Si son equivalentes por catálogo, aclaralo.`;
  } else {
    block = `
- Cultivo: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}`;
  }

  return `${base}

## Contexto seleccionado en la app (no inventes ubicaciones fuera de esto)
- Región: ${ctx.regionName ?? "—"} · id: ${ctx.regionId ?? "—"}
${block}
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
