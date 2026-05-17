"use client";

import * as React from "react";
import { Loader2, MapPin, Mountain, Search, X } from "lucide-react";

import { CurrentLocationButton } from "@/components/selection/current-location-button";
import { Input } from "@/components/ui/input";
import { findNearestRegion } from "@/lib/api/regions";
import {
  searchLatamPlaces,
  type GeocodeResult,
} from "@/lib/api/geocoding";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/stores/selection-store";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

function formatCoord(n: number, axis: "lat" | "lng"): string {
  const abs = Math.abs(n).toFixed(4);
  const hemi =
    axis === "lat" ? (n >= 0 ? "N" : "S") : n >= 0 ? "E" : "W";
  return `${abs}° ${hemi}`;
}

function placeLabel(r: GeocodeResult): string {
  const parts = [r.name];
  if (r.admin1 && r.admin1 !== r.name) parts.push(r.admin1);
  parts.push(r.countryCode);
  return parts.join(" · ");
}

export function LocationPicker({ className }: { className?: string }) {
  const region = useSelectionStore((s) => s.region);
  const customLocation = useSelectionStore((s) => s.customLocation);
  const setCustomLocation = useSelectionStore((s) => s.setCustomLocation);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<GeocodeResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    const handle = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const next = await searchLatamPlaces(trimmed, controller.signal);
        setResults(next);
        setOpen(true);
        if (!next.length) {
          setError("Sin resultados en Latinoamérica (Brasil excluido).");
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("No pudimos buscar ahora. Intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [query]);

  const trimmedQuery = query.trim();
  const isQueryValid = trimmedQuery.length >= MIN_QUERY_LENGTH;

  function handlePick(result: GeocodeResult) {
    setCustomLocation({
      lat: result.lat,
      lng: result.lng,
      elevation: result.elevation,
      label: placeLabel(result),
      countryCode: result.countryCode,
    });
    setQuery("");
    setResults([]);
    setOpen(false);
    setError(null);
  }

  function handleClear() {
    setCustomLocation(null);
    setQuery("");
    setResults([]);
    setOpen(false);
    setError(null);
  }

  const displayLat = customLocation?.lat ?? region.center.lat;
  const displayLng = customLocation?.lng ?? region.center.lng;
  const displayElevation = customLocation?.elevation ?? region.elevation;
  const nearest = customLocation
    ? findNearestRegion(customLocation.lat, customLocation.lng)
    : null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1.5">
        <label htmlFor="location-search" className="eyebrow">
          Ubicación
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="location-search"
              type="search"
              autoComplete="off"
              placeholder="Buscar ciudad o municipio en Latinoamérica…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length && setOpen(true)}
              className="h-10 w-full rounded-full pl-10 pr-10"
              aria-expanded={open}
              aria-controls="location-results"
              aria-autocomplete="list"
              role="combobox"
            />
            {loading && isQueryValid && (
              <Loader2
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden
              />
            )}
          </div>
          <CurrentLocationButton
            label="Usar mi ubicación"
            className="h-10 shrink-0"
          />
        </div>
        {open && isQueryValid && (results.length > 0 || error) && (
          <div
            id="location-results"
            role="listbox"
            className="glass mt-2 max-h-72 overflow-auto rounded-xl p-1 text-sm"
          >
            {error && !results.length ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">{error}</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handlePick(r)}
                  className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-foreground">
                      {r.name}
                      {r.admin1 && r.admin1 !== r.name ? (
                        <span className="text-muted-foreground"> · {r.admin1}</span>
                      ) : null}
                    </span>
                    <span className="numeric block text-[10px] uppercase tracking-wider text-muted-foreground">
                      {r.country} · {r.countryCode}
                      {typeof r.elevation === "number" && r.elevation > 0
                        ? ` · ${Math.round(r.elevation)} m`
                        : ""}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="glass space-y-2 rounded-xl p-4 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Selección</p>
            <p className="mt-1 truncate font-medium text-foreground">
              {customLocation ? customLocation.label : region.name}
              {customLocation ? null : (
                <span className="text-muted-foreground numeric"> · {region.country}</span>
              )}
            </p>
          </div>
          {customLocation && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground"
            >
              <X className="size-3" aria-hidden />
              Quitar
            </button>
          )}
        </div>

        <div className="hairline" />

        <dl className="grid grid-cols-3 gap-3 text-xs">
          <div className="min-w-0">
            <dt className="eyebrow">Latitud</dt>
            <dd className="numeric mt-1 text-foreground">{formatCoord(displayLat, "lat")}</dd>
          </div>
          <div className="min-w-0">
            <dt className="eyebrow">Longitud</dt>
            <dd className="numeric mt-1 text-foreground">{formatCoord(displayLng, "lng")}</dd>
          </div>
          <div className="min-w-0">
            <dt className="eyebrow">Altitud</dt>
            <dd className="numeric mt-1 inline-flex items-center gap-1 text-foreground">
              <Mountain className="size-3 text-muted-foreground" aria-hidden />
              {typeof displayElevation === "number" ? `${Math.round(displayElevation)} m` : "—"}
            </dd>
          </div>
        </dl>

        {nearest && (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Región registrada más cercana:{" "}
            <span className="font-medium text-foreground">{nearest.region.name}</span>{" "}
            <span className="numeric">
              · {nearest.region.country} · ~{Math.round(nearest.distanceKm)} km
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
