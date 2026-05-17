"use client";

import * as React from "react";
import { toast } from "sonner";

type Severity = "alta" | "media" | "baja";

interface AdvisoryEvent {
  type: "advisory";
  title: string;
  severity: Severity;
  message: string;
  generatedAt: string;
}

function isAdvisory(value: unknown): value is AdvisoryEvent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.type === "advisory" &&
    typeof v.title === "string" &&
    typeof v.message === "string" &&
    (v.severity === "alta" || v.severity === "media" || v.severity === "baja")
  );
}

export function AlertsToaster() {
  React.useEffect(() => {
    const source = new EventSource("/api/alerts/stream");

    source.onmessage = (ev) => {
      try {
        const parsed: unknown = JSON.parse(ev.data);
        if (!isAdvisory(parsed)) return;
        const opts = { description: parsed.message };
        if (parsed.severity === "alta") toast.error(parsed.title, opts);
        else if (parsed.severity === "media") toast.warning(parsed.title, opts);
        else toast.message(parsed.title, opts);
      } catch {
        /* malformed payload — drop */
      }
    };

    source.onerror = () => {
      /* let the browser handle reconnection backoff */
    };

    return () => source.close();
  }, []);

  return null;
}
