export interface Region {
  id: string;
  name: string;

  country: string;

  subdivision?: string;

  center: { lat: number; lng: number };

  elevation?: number;

  zoom: number;

  summary: string;
}
