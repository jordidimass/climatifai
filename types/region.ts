export interface Region {
  id: string;
  name: string;
  /** Country (ISO-3166-1 alpha-2). */
  country: string;
  /** Sub-national descriptor: state, province, comarca, etc. */
  subdivision?: string;
  /** Center of the region, used to drive the map viewport. */
  center: { lat: number; lng: number };
  /** Mean elevation of the region in metres above sea level. Optional. */
  elevation?: number;
  /** Recommended initial zoom level for the map. */
  zoom: number;
  /** One-line agronomic summary used in headers. */
  summary: string;
}
