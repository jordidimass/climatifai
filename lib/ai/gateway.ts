import "server-only";

import { createGateway } from "ai";

import { serverEnv } from "@/lib/env";

export const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4-6";

export const gatewayClient = createGateway({
  apiKey: serverEnv.AI_GATEWAY_API_KEY,
});

export const CLIMATIFAI_SYSTEM_PROMPT = `Eres Climatifai, un analista climático agrícola para Latinoamérica.
Ayudas a productores, agrónomos y cooperativas a interpretar datos climáticos para cultivos y regiones específicas.
Sé concreto: cita la métrica, la magnitud y la acción recomendada.
Mantén los pies en la tierra: cuando haya incertidumbre, dilo. Usa el sistema métrico. Responde en español claro y en menos de 200 palabras salvo que pidan más detalle.`;
