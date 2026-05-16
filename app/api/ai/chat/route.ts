import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  CLIMATIFAI_SYSTEM_PROMPT,
  DEFAULT_MODEL_ID,
  gatewayClient,
} from "@/lib/ai/gateway";

export const maxDuration = 30;

export async function POST(request: Request) {
  let payload: { messages: UIMessage[] };
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

  const result = streamText({
    model: gatewayClient(DEFAULT_MODEL_ID),
    system: CLIMATIFAI_SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
