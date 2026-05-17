"use client";

import * as React from "react";
import { toast } from "sonner";

import { fetchElevation } from "@/lib/api/geocoding";
import { useSelectionStore } from "@/stores/selection-store";

interface UseCurrentLocationResult {
  request: () => void;
  requesting: boolean;
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 5 * 60 * 1000,
};

export function useCurrentLocation(): UseCurrentLocationResult {
  const setCustomLocation = useSelectionStore((s) => s.setCustomLocation);
  const [requesting, setRequesting] = React.useState(false);

  const request = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Tu navegador no admite geolocalización.");
      return;
    }
    setRequesting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, altitude } = pos.coords;
        // Browser GPS altitude is `null` on most desktops and unreliable
        // (often 0) on phones without a barometric fix. Treat 0 as unknown
        // and fall back to a server-side DEM lookup.
        const browserElevation =
          typeof altitude === "number" &&
          Number.isFinite(altitude) &&
          altitude !== 0
            ? altitude
            : undefined;
        const elevation =
          browserElevation ?? (await fetchElevation(latitude, longitude));

        setCustomLocation({
          lat: latitude,
          lng: longitude,
          elevation,
          label: "Mi ubicación",
          countryCode: "",
        });
        setRequesting(false);
      },
      (err) => {
        setRequesting(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Permiso de ubicación denegado.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error("No pudimos obtener tu ubicación.");
        } else if (err.code === err.TIMEOUT) {
          toast.error("La solicitud de ubicación tardó demasiado.");
        } else {
          toast.error("Error al obtener tu ubicación.");
        }
      },
      GEOLOCATION_OPTIONS,
    );
  }, [setCustomLocation]);

  return { request, requesting };
}
