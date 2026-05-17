"use client";

import { Popup } from "react-map-gl/mapbox";

import { useFireStore } from "@/stores/fire-store";

const INSTRUMENT_LABEL: Record<string, string> = {
  VIIRS: "VIIRS",
  MODIS: "MODIS",
};

const SOURCE_LABEL: Record<string, string> = {
  VIIRS_SNPP_NRT: "Suomi NPP",
  VIIRS_NOAA20_NRT: "NOAA-20",
  VIIRS_NOAA21_NRT: "NOAA-21",
  MODIS_NRT: "Terra / Aqua",
};

const CONFIDENCE_LABEL = {
  low: "Baja",
  nominal: "Nominal",
  high: "Alta",
} as const;

const DAYNIGHT_LABEL = { D: "Día", N: "Noche", U: "—" } as const;

export function FireDetailPopover() {
  const hotspot = useFireStore((s) => s.selectedHotspot);
  const select = useFireStore((s) => s.selectHotspot);

  if (!hotspot) return null;

  const [lng, lat] = hotspot.geometry.coordinates;
  const p = hotspot.properties;
  const when = new Date(p.ts).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      closeOnClick={false}
      onClose={() => select(null)}
      offset={12}
      maxWidth="260px"
      className="climatifai-popup"
    >
      <div className="space-y-1.5 text-xs">
        <p className="eyebrow text-foreground/80">Foco térmico</p>
        <p className="font-medium text-foreground">
          {when} <span className="text-muted-foreground">UTC</span>
        </p>
        <dl className="numeric grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
          <dt className="text-muted-foreground">FRP</dt>
          <dd>{p.frp.toFixed(1)} MW</dd>
          <dt className="text-muted-foreground">Brillo</dt>
          <dd>{p.brightness.toFixed(0)} K</dd>
          <dt className="text-muted-foreground">Confianza</dt>
          <dd>{CONFIDENCE_LABEL[p.confidence]}</dd>
          <dt className="text-muted-foreground">Pase</dt>
          <dd>{DAYNIGHT_LABEL[p.daynight]}</dd>
          <dt className="text-muted-foreground">Sensor</dt>
          <dd>{INSTRUMENT_LABEL[p.instrument] ?? (p.instrument || "—")}</dd>
          <dt className="text-muted-foreground">Satélite</dt>
          <dd>{SOURCE_LABEL[p.source] ?? (p.satellite || "—")}</dd>
          <dt className="text-muted-foreground">Coords</dt>
          <dd>
            {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </dd>
        </dl>
      </div>
    </Popup>
  );
}
