export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { gqlFetch } from "@/lib/api/gql-client";
import { serverEnv } from "@/lib/env";

const TICK_MS = 18_000;
const HEARTBEAT_MS = 25_000;
const REFRESH_TICKS = 5; // re-fetch alerts from backend every N ticks

interface AlertItem {
  title: string;
  severity: string;
  message: string;
  generatedAt: string;
  region?: string | null;
  alertType?: string | null;
}

interface AlertsGql {
  alerts: {
    generatedAt: string;
    zonesChecked: number;
    alerts: AlertItem[];
  };
}

const FALLBACK_ALERTS: AlertItem[] = [
  {
    title: "Ola de calor",
    severity: "alta",
    message: "Pico de 38°C previsto en 48 h para el Bajío. Adelanta riego de maíz.",
    generatedAt: new Date().toISOString(),
  },
  {
    title: "Déficit hídrico",
    severity: "media",
    message: "Precipitación acumulada -32% vs. media 1991-2020 en Pampa Húmeda.",
    generatedAt: new Date().toISOString(),
  },
  {
    title: "Frente húmedo",
    severity: "baja",
    message: "Sistema frontal aporta 25-40 mm al Eje Cafetero esta semana.",
    generatedAt: new Date().toISOString(),
  },
];

async function fetchAlerts(): Promise<AlertItem[]> {
  if (!serverEnv.AGRI_GRAPHQL_URL) return FALLBACK_ALERTS;
  try {
    const { alerts } = await gqlFetch<AlertsGql>(
      `query {
        alerts {
          generatedAt
          zonesChecked
          alerts { title severity message generatedAt region alertType }
        }
      }`,
    );
    return alerts.alerts.length > 0 ? alerts.alerts : FALLBACK_ALERTS;
  } catch {
    return FALLBACK_ALERTS;
  }
}

export function GET() {
  const encoder = new TextEncoder();
  let tick: ReturnType<typeof setInterval> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {}
      };

      send({ type: "ready" });

      let pool: AlertItem[] = await fetchAlerts();
      let i = 0;
      let tickCount = 0;

      tick = setInterval(async () => {
        tickCount += 1;
        if (tickCount % REFRESH_TICKS === 0) {
          pool = await fetchAlerts();
        }
        if (pool.length === 0) return;
        const alert = pool[i % pool.length];
        i += 1;
        send({
          type: "advisory",
          title: alert.title,
          severity: alert.severity,
          message: alert.message,
          region: alert.region ?? undefined,
          generatedAt: alert.generatedAt,
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
