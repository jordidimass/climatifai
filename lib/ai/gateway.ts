import "server-only";

import { createGateway } from "ai";

import { serverEnv } from "@/lib/env";

/**
 * Default model used by Climatifai's AI insights routes. Pinned to a
 * Claude Sonnet revision via the Vercel AI Gateway — swap by editing
 * the export. The gateway lets us change providers without touching
 * callers (just change the model id, e.g. `openai/gpt-5`).
 */
export const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4-6";

/**
 * Pre-configured AI Gateway client. Reads `AI_GATEWAY_API_KEY` from the
 * environment. Falls back to the implicit Vercel OIDC token when
 * deployed on Vercel (the SDK handles that automatically).
 */
export const gatewayClient = createGateway({
  apiKey: serverEnv.AI_GATEWAY_API_KEY,
});

/**
 * Convenience system prompt for agronomic chat. Concise on purpose —
 * tune per-route, never bake long instructions in here.
 */
export const CLIMATIFAI_SYSTEM_PROMPT = `Eres Climatifai, un analista climático agrícola para Latinoamérica.
Ayudas a productores, agrónomos y cooperativas a interpretar datos climáticos para cultivos y regiones específicas.
Sé concreto: cita la métrica, la magnitud y la acción recomendada.
Mantén los pies en la tierra: cuando haya incertidumbre, dilo. Usa el sistema métrico. Responde en español claro y en menos de 200 palabras salvo que pidan más detalle.`;
