const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const ELEVATION_URL = "https://api.open-meteo.com/v1/elevation";

export const LATAM_COUNTRIES = new Set<string>([
  "MX", // Mexico
  "GT", // Guatemala
  "HN", // Honduras
  "SV", // El Salvador
  "NI", // Nicaragua
  "CR", // Costa Rica
  "PA", // Panamá
  "CU", // Cuba
  "DO", // Dominican Republic
  "PR", // Puerto Rico
  "HT", // Haiti
  "CO", // Colombia
  "VE", // Venezuela
  "EC", // Ecuador
  "PE", // Perú
  "BO", // Bolivia
  "CL", // Chile
  "AR", // Argentina
  "UY", // Uruguay
  "PY", // Paraguay
]);

export interface GeocodeResult {
  id: number;
  name: string;
  admin1?: string;
  countryCode: string;
  country: string;
  lat: number;
  lng: number;

  elevation?: number;
}

interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  country?: string;
  admin1?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

export async function searchLatamPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { signal });
  if (!res.ok) return [];

  const json = (await res.json()) as OpenMeteoGeocodingResponse;
  const raw = json.results ?? [];

  return raw
    .filter(
      (r) =>
        typeof r.country_code === "string" &&
        LATAM_COUNTRIES.has(r.country_code),
    )
    .map<GeocodeResult>((r) => ({
      id: r.id,
      name: r.name,
      admin1: r.admin1,
      countryCode: r.country_code as string,
      country: r.country ?? r.country_code ?? "",
      lat: r.latitude,
      lng: r.longitude,
      elevation:
        typeof r.elevation === "number" && r.elevation !== 0
          ? r.elevation
          : undefined,
    }));
}

interface OpenMeteoElevationResponse {
  elevation?: number[];
}

export async function fetchElevation(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<number | undefined> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  const url = new URL(ELEVATION_URL);
  url.searchParams.set("latitude", lat.toFixed(5));
  url.searchParams.set("longitude", lng.toFixed(5));

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return undefined;
    const json = (await res.json()) as OpenMeteoElevationResponse;
    const value = json.elevation?.[0];
    if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
      return undefined;
    }
    return value;
  } catch {
    return undefined;
  }
}
