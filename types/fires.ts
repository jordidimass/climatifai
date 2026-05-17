export type FirmsSource =
  | "VIIRS_SNPP_NRT"
  | "VIIRS_NOAA20_NRT"
  | "VIIRS_NOAA21_NRT"
  | "MODIS_NRT";

export type FireDayRange = 1 | 2 | 7 | 30;

export type FireConfidenceBand = "low" | "nominal" | "high";

export interface HotspotProperties {

  ts: number;

  acqDate: string;

  acqTime: string;

  satellite: string;

  instrument: string;

  source: FirmsSource;

  frp: number;

  brightness: number;

  confidence: FireConfidenceBand;

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
