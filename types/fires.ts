export type FirmsSource =
  | "VIIRS_SNPP_NRT"
  | "VIIRS_NOAA20_NRT"
  | "VIIRS_NOAA21_NRT"
  | "MODIS_NRT";

export type FireDayRange = 1 | 2 | 7 | 30;

export type FireConfidenceBand = "low" | "nominal" | "high";

export interface HotspotProperties {
  /** UTC epoch milliseconds, derived from acq_date + acq_time. */
  ts: number;
  /** ISO date as returned by FIRMS, e.g. "2026-05-15". */
  acqDate: string;
  /** HHMM as returned by FIRMS (zero-padded). */
  acqTime: string;
  /** Satellite shortcode ("N", "1", "A", "T", "Aqua", "Terra"...). */
  satellite: string;
  /** Sensor instrument ("MODIS" | "VIIRS"). */
  instrument: string;
  /** Source key — which FIRMS feed this row came from. */
  source: FirmsSource;
  /** Fire Radiative Power, megawatts. */
  frp: number;
  /** Brightness in kelvin (T21 for MODIS, bright_ti4 for VIIRS). */
  brightness: number;
  /** FIRMS confidence: numeric 0-100 for MODIS, "l"/"n"/"h" for VIIRS. Normalized to a band. */
  confidence: FireConfidenceBand;
  /** "D" | "N" (day / night overpass). */
  daynight: "D" | "N" | "U";
}

export type HotspotFeature = GeoJSON.Feature<GeoJSON.Point, HotspotProperties>;
export type HotspotFC = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  HotspotProperties
>;

export interface BBox {
  west: number;
  south: number;
  east: number;
  north: number;
}
