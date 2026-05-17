export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TICK_MS = 18_000;
const HEARTBEAT_MS = 25_000;

type Severity = "alta" | "media" | "baja";

interface SyntheticAlert {
  title: string;
  severity: Severity;
  message: string;
}

const SAMPLE_ALERTS: SyntheticAlert[] = [
  {
    title: "Ola de calor",
    severity: "alta",
    message: "Pico de 38°C previsto en 48 h para el Bajío. Adelanta riego de maíz.",
  },
  {
    title: "Déficit hídrico",
    severity: "media",
    message: "Precipitación acumulada -32% vs. media 1991-2020 en Pampa Húmeda.",
  },
  {
    title: "Helada tardía",
    severity: "media",
    message: "Riesgo de helada en Valle Central durante 36 h. Protege frutales.",
  },
  {
    title: "Frente húmedo",
    severity: "baja",
    message: "Sistema frontal aporta 25-40 mm al Eje Cafetero esta semana.",
  },
  {
    title: "Calor nocturno",
    severity: "alta",
    message: "Mínimas sobre 22°C en Cerrado — vigila café y cacao.",
  },
];

export function GET() {
  const encoder = new TextEncoder();
  let tick: ReturnType<typeof setInterval> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (payload: object) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );
        } catch {}
      };

      send({ type: "ready" });

      let i = 0;
      tick = setInterval(() => {
        const alert = SAMPLE_ALERTS[i % SAMPLE_ALERTS.length];
        i += 1;
        send({
          type: "advisory",
          ...alert,
          generatedAt: new Date().toISOString(),
        });
      }, TICK_MS);

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        } catch {}
      }, HEARTBEAT_MS);
    },
    cancel() {
      if (tick) clearInterval(tick);
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
