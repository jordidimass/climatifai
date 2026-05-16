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
export const CLIMATIFAI_SYSTEM_PROMPT = `You are Climatifai, an agronomic climate analyst.
You help farmers and agronomists interpret climate data for specific crops and regions.
Be concrete: cite the metric, the magnitude, and what action it implies.
Stay grounded — when uncertain, say so. Prefer the metric system. Keep replies under 200 words unless asked for depth.`;
