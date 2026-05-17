"use client";

import * as React from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import { CurrentLocationButton } from "@/components/selection/current-location-button";
import { Input } from "@/components/ui/input";
import {
  searchLatamPlaces,
  type GeocodeResult,
} from "@/lib/api/geocoding";
import { useSelectionStore } from "@/stores/selection-store";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

function placeLabel(r: GeocodeResult): string {
  const parts = [r.name];
  if (r.admin1 && r.admin1 !== r.name) parts.push(r.admin1);
  parts.push(r.countryCode);
  return parts.join(" · ");
}

interface FireSearchProps {
  className?: string;
}

export function FireSearch({ className }: FireSearchProps) {
  const setCustomLocation = useSelectionStore((s) => s.setCustomLocation);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<GeocodeResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleQueryChange = React.useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }

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

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(ev: PointerEvent) {
      const node = containerRef.current;
      if (node && ev.target instanceof Node && !node.contains(ev.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

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

  const trimmedQuery = query.trim();
  const isQueryValid = trimmedQuery.length >= MIN_QUERY_LENGTH;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-auto relative w-full max-w-xs", className)}
    >
      <label className="sr-only" htmlFor="fire-map-search">
        Buscar zona en Latinoamérica
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="fire-map-search"
        type="search"
        autoComplete="off"
        placeholder="Buscar ciudad o región…"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            (e.currentTarget as HTMLInputElement).blur();
          }
          if (e.key === "Enter" && results[0]) {
            e.preventDefault();
            handlePick(results[0]);
          }
        }}
        className="h-10 rounded-full bg-card/90 pl-10 pr-10 shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-md"
        aria-expanded={open}
        aria-controls="fire-search-results"
        aria-autocomplete="list"
        role="combobox"
      />
      {loading && isQueryValid && (
        <Loader2
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden
        />
      )}

      {open && isQueryValid && (results.length > 0 || error) ? (
        <div
          id="fire-search-results"
          role="listbox"
          className="glass absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-xl p-1 text-sm shadow-lg"
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
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground">
                    {r.name}
                    {r.admin1 && r.admin1 !== r.name ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · {r.admin1}
                      </span>
                    ) : null}
                  </span>
                  <span className="numeric block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.country} · {r.countryCode}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}

      <CurrentLocationButton
        className="mt-2 w-full justify-center bg-card/90 shadow-sm backdrop-blur-sm"
        label="Usar mi ubicación"
      />
    </div>
  );
}
