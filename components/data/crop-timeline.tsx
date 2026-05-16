"use client";

import { useSelectionStore } from "@/stores/selection-store";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

type Phase = "planting" | "growing" | "harvest" | "off";

/**
 * Ciclo ejemplo con período fuera de temporada · reemplazar con crop_calendar.
 */
function phaseForMonth(index: number): Phase {
  if (index === 11 || index === 0 || index === 1) return "off";
  if (index === 2 || index === 3) return "planting";
  if (index >= 4 && index <= 8) return "growing";
  return "harvest";
}

const PHASE_STYLES: Record<Phase, string> = {
  planting:
    "bg-gradient-to-t from-chart-3/15 via-chart-3/55 to-chart-3/85",
  growing:
    "bg-gradient-to-t from-chart-2/15 via-chart-2/50 to-chart-2/80",
  harvest:
    "bg-gradient-to-t from-chart-5/15 via-chart-5/50 to-chart-5/85",
  off: "bg-muted/60",
};

const PHASE_LABEL_ES: Record<Phase, string> = {
  planting: "Siembra",
  growing: "Crecimiento",
  harvest: "Cosecha",
  off: "Fuera de ciclo",
};

/** Demo hasta cablear desviaciones reales. */
const DEMO_MONTH_RISK = (i: number) => i === 6 || i === 7;

export function CropTimeline() {
  const crop = useSelectionStore((s) => s.crop);
  const today = new Date();
  const todayMonthIdx = Math.min(Math.max(today.getMonth(), 0), 11);

  return (
    <section
      className={cn(
        "glass cf-crop-timeline-wrap motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 space-y-3 rounded-xl border border-border/70 p-4",
      )}
      aria-label="Calendario tipo del ciclo productivo"
    >
      <div
        className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 space-y-2"
        style={{ animationDelay: "60ms" }}
      >
        <div>
          <p className="eyebrow text-muted-foreground">Ciclo del cultivo</p>
          <p className="font-medium text-foreground">{crop.name}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5 text-xs leading-snug text-muted-foreground">
          <p id="crop-timeline-howto-heading" className="mb-2 font-semibold text-foreground">
            Cómo leer esta barra
          </p>
          <ol className="mb-2 list-none space-y-2 pl-0">
            <li className="flex gap-2.5">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary ring-1 ring-primary/20">
                1
              </span>
              <span>
                Cada <strong className="font-medium text-foreground">columna</strong>{" "}
                es un mes; el orden va de izquierda a derecha durante el año.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary ring-1 ring-primary/20">
                2
              </span>
              <span>
                El <strong className="font-medium text-foreground">color alto</strong>{" "}
                indica la etapa del cultivo ahí (siembra, crecimiento, cosecha o
                tiempo libre según esta plantilla).
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-[0.65rem] font-bold text-destructive ring-1 ring-destructive/25">
                3
              </span>
              <span>
                Si ves una{" "}
                <strong className="font-medium text-destructive">franja roja</strong>{" "}
                en la base y dice{" "}
                <strong className="font-medium text-destructive">alerta</strong>{" "}
                bajo el mes, ese mes está marcado como “clima poco habitual”{" "}
                <span className="text-muted-foreground">(solo ejemplo).</span>
              </span>
            </li>
          </ol>
          <p className="border-t border-border/60 pt-2 text-[0.65rem] text-muted-foreground">
            Paso el cursor sobre cualquier mes para ver el nombre, la etapa y
            más detalle.
          </p>
        </div>
      </div>

      <p
        className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 text-[0.65rem] font-medium text-muted-foreground"
        style={{ animationDelay: "100ms" }}
      >
        Orden temporal: Enero a la izquierda · Diciembre a la derecha.
      </p>

      <div className="-mx-1 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
        <div className="relative min-w-[min(100%,440px)]">
          <div
            className="relative isolate flex h-14 min-w-[320px] gap-px overflow-hidden rounded-lg bg-border/70 ring-1 ring-border/50 motion-safe:transition-shadow motion-safe:duration-700 motion-safe:hover:ring-primary/30"
            role="group"
            aria-label="Doce meses en barra horizontal"
          >
            <div
              aria-hidden
              className="cf-crop-track-gleam pointer-events-none absolute inset-0 z-0 rounded-lg motion-reduce:hidden"
            />
            {MONTH_LABELS.map((label, i) => {
              const phase = phaseForMonth(i);
              const risky = DEMO_MONTH_RISK(i);
              const delayMs = 120 + i * 42;
              return (
                <div
                  key={`m-${label}-${i}`}
                  className="cf-crop-segment-cell group relative z-[1] min-w-[18px] flex-1 px-px"
                  title={
                    risky
                      ? `${MONTH_LABELS[i]} · ${PHASE_LABEL_ES[phase]}. Ejemplo de alerta: en este mes el clima esperado se ve muy distinto al de “siempre” según datos de muestra — conviene revisar el detalle cuando haya datos reales.`
                      : `${MONTH_LABELS[i]} · ${PHASE_LABEL_ES[phase]}`
                  }
                >
                  <div
                    className={cn(
                      "motion-safe:transition-[filter,transform] motion-safe:duration-200 motion-safe:ease-out",
                      "relative h-full w-full overflow-hidden rounded-sm",
                      PHASE_STYLES[phase],
                      "cf-crop-segment-fill motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:scale-y-100",
                    )}
                    style={{ animationDelay: `${delayMs}ms` }}
                  >
                    {risky ? (
                      <>
                        <span
                          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-3 rounded-b-[3px] bg-destructive bg-gradient-to-r from-destructive via-destructive to-destructive/85 shadow-[0_-3px_10px_-2px_rgb(239_68_68_/_0.55)]"
                          aria-hidden
                        />
                        <span className="sr-only">
                          Mes ejemplo con alerta de clima poco habitual:{" "}
                          {MONTH_LABELS[i]}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div
              className={cn(
                "cf-crop-today-line pointer-events-none absolute bottom-[-2px] -top-0.5 z-[4] motion-reduce:opacity-100",
                "-translate-x-1/2",
              )}
              style={{
                left: `${((todayMonthIdx + 0.5) / 12) * 100}%`,
              }}
              aria-hidden
            />
          </div>

          <div className="mt-1 grid min-w-[320px] grid-cols-12 gap-px text-center tabular-nums">
            {MONTH_LABELS.map((m, i) => {
              const risky = DEMO_MONTH_RISK(i);
              return (
                <div
                  key={m}
                  className={cn(
                    "cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 flex min-h-[38px] flex-col items-center justify-start gap-0.5 pb-px",
                  )}
                  style={{ animationDelay: `${380 + i * 24}ms` }}
                >
                  <span className="text-[0.6rem] font-medium uppercase tracking-tight text-muted-foreground">
                    {m.slice(0, 3)}.
                  </span>
                  {risky ? (
                    <span
                      className="cf-crop-risk-marker rounded px-1 py-px text-[0.52rem] font-bold uppercase leading-none text-destructive ring-1 ring-destructive/35 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:scale-100"
                      aria-hidden
                    >
                      alerta
                    </span>
                  ) : (
                    <span aria-hidden className="h-[0.6875rem] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border/60 pt-3">
        <div className="space-y-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Etapa del cultivo (color del bloque)
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[0.65rem] text-muted-foreground">
            {(Object.keys(PHASE_LABEL_ES) as Phase[]).map((p, i) => (
              <li
                key={p}
                className="cf-crop-mini-rise motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 flex items-center gap-1.5"
                style={{ animationDelay: `${700 + i * 55}ms` }}
              >
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-sm ring-1 ring-border/70",
                    "motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-125",
                    p === "planting" && "bg-chart-3/80",
                    p === "growing" && "bg-chart-2/80",
                    p === "harvest" && "bg-chart-5/80",
                    p === "off" && "bg-muted",
                  )}
                />
                <span className="text-foreground/90">{PHASE_LABEL_ES[p]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Otras señales en la misma vista
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.65rem]">
            <li
              className="cf-crop-mini-rise flex items-start gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 sm:items-center sm:gap-3"
              style={{ animationDelay: "900ms" }}
            >
              <span
                className="relative mt-0.5 h-[22px] w-14 shrink-0 overflow-hidden rounded-sm bg-chart-2/35 ring-1 ring-border/60 sm:mt-0"
                aria-hidden
              >
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[9px] bg-destructive" />
              </span>
              <span className="max-w-[16rem] leading-snug text-muted-foreground">
                <strong className="font-medium text-foreground">Alerta:</strong>{" "}
                franja roja abajo = “aquí los datos de prueba muestran un mes con
                clima muy poco habitual” (no solo la etapa del cultivo).
              </span>
            </li>
            <li
              className="cf-crop-mini-rise flex items-start gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
              style={{ animationDelay: "935ms" }}
            >
              <span className="mt-px inline-flex h-5 shrink-0 items-center rounded px-1.5 py-0 text-[0.52rem] font-bold uppercase text-destructive ring-1 ring-destructive/35">
                alerta
              </span>
              <span className="leading-snug text-muted-foreground">
                <strong className="font-medium text-foreground">Palabra:</strong>{" "}
                queda pegada al mes que corresponde, para ubicar rápido en el
                calendario abajo del gráfico.
              </span>
            </li>
            <li
              className="cf-crop-mini-rise flex items-center gap-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
              style={{ animationDelay: "975ms" }}
            >
              <span
                className="h-5 w-0 shrink-0 border-l-2 border-dashed border-foreground/50 motion-reduce:opacity-90"
                aria-hidden
              />
              <span className="leading-snug text-muted-foreground">
                <strong className="font-medium text-foreground">Línea punteada</strong>
                {" "}
                marca el mes actual (“hoy” en esta pantalla).
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
