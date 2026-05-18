import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  CLIMATIFAI_SYSTEM_PROMPT,
  DEFAULT_MODEL_ID,
  gatewayClient,
} from "@/lib/ai/gateway";
import { gqlFetch } from "@/lib/api/gql-client";
import { serverEnv } from "@/lib/env";

export const maxDuration = 30;

type SelectionContextPayload = {
  regionId?: string;
  regionName?: string;
  cropId?: string;
  cropName?: string;
  compareCropId?: string;
  compareCropName?: string;
  regionSummary?: string;

  geocodedLabel?: string;
  latitude?: number;
  longitude?: number;
  elevationMeters?: number;
};

interface RagPassage {
  text: string;
  source: string;
  score: number;
}

interface RagGql {
  ragContext: RagPassage[];
}

async function fetchRagContext(query: string): Promise<RagPassage[]> {
  if (!serverEnv.CLIMATIFAI_API_URL || !query.trim()) return [];
  try {
    const { ragContext } = await gqlFetch<RagGql>(
      `query RagContext($query: String!, $limit: Int!) {
        ragContext(query: $query, limit: $limit) { text source score }
      }`,
      { query, limit: 3 },
    );
    return ragContext.filter((p) => p.score >= 0.3);
  } catch {
    return [];
  }
}

function buildRagBlock(passages: RagPassage[]): string {
  if (!passages.length) return "";
  const items = passages
    .map((p, i) => `[${i + 1}] (${p.source})\n${p.text}`)
    .join("\n\n");
  return `\n\n## Contexto agroclimático recuperado (RAG)\n${items}`;
}

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
## Cultivo en foco
- Cultivo actual: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}

## Cultivo de comparación
- Comparar con: ${ctx.compareCropName ?? "—"} · id: ${ctx.compareCropId ?? "—"}
- Contrastá aptitudes referenciales, ventanas típicas y riesgos entre **ambos** cultivos en esta misma región catalogada; si los catálogo los trata equivalente para este polígono, decilo`;
  } else {
    block = `
- Cultivo seleccionado: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}`;
  }

  let geoLine = "";
  if (
    ctx.geocodedLabel?.trim() &&
    typeof ctx.latitude === "number" &&
    typeof ctx.longitude === "number"
  ) {
    const elev =
      typeof ctx.elevationMeters === "number"
        ? ` · altitud ~${Math.round(ctx.elevationMeters)} m`
        : "";
    geoLine = `
- **Ubicación geocodificada (buscador):** ${ctx.geocodedLabel.trim()} · coordenadas aprox. ${ctx.latitude.toFixed(4)}, ${ctx.longitude.toFixed(4)}${elev}
- Este punto aclara ubicación solicitada por el usuario; las series agroclimáticas operativas siguen ligadas al polígono de la región de catálogo indicada abajo.`;
  }

  return `${base}
## Contexto elegido por el usuario en la aplicación (no inventes ubicaciones fuera de esto)
- Región catalogada (${ctx.regionName ?? "—"} · id ${ctx.regionId ?? "—"})${geoLine}
${block}
- Extracto público conocido hasta ahora sobre la región: ${ctx.regionSummary ?? "—"}`;
}

export async function POST(request: Request) {
  let payload: {
    messages: UIMessage[];
    context?: SelectionContextPayload;
  };
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        error: "No pudimos leer la petición: el cuerpo no es JSON válido.",
      },
      { status: 400 },
    );
  }

  if (!Array.isArray(payload.messages)) {
    return Response.json(
      {
        error: 'Esperamos un JSON como { "messages": [...] } siguiendo UIMessage.',
      },
      { status: 400 },
    );
  }

  const lastUserParts = payload.messages.findLast((m) => m.role === "user")?.parts ?? [];
  const queryText = lastUserParts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");

  const [ragPassages] = await Promise.all([fetchRagContext(queryText)]);

  const messages = await convertToModelMessages(payload.messages);
  const system =
    withSelectionContext(CLIMATIFAI_SYSTEM_PROMPT, payload.context ?? undefined) +
    buildRagBlock(ragPassages);

  const result = streamText({
    model: gatewayClient(DEFAULT_MODEL_ID),
    system,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
