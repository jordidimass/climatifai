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
  if (!serverEnv.AGRI_GRAPHQL_URL || !query.trim()) return [];
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
## Cultivo principal
- Cultivo actual: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}

## Cultivo comparado
- Comparar con: ${ctx.compareCropName ?? "—"} · id: ${ctx.compareCropId ?? "—"}
- Respondé situaciones contrastando aptitudes, ventanas agronómicas y riesgos entre **ambos** cultivos dentro de esta región. Si son equivalentes por catálogo, aclaralo.`;
  } else {
    block = `
- Cultivo: ${ctx.cropName ?? "—"} · id: ${ctx.cropId ?? "—"}`;
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
- Usá este punto como referencia espacial; los datos operativos del MVP siguen anclados a la región de catálogo indicada abajo.`;
  }

  return `${base}
## Contexto seleccionado en la app (no inventes ubicaciones fuera de esto)
- Región (catálogo, más cercana al punto): ${ctx.regionName ?? "—"} · id: ${ctx.regionId ?? "—"}${geoLine}
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
