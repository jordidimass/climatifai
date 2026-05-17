import type { CropId } from "@/types/crop";

export type CropSuitabilityStatus =
  | "suitable"
  | "moderate"
  | "risky"
  | "not_recommended"
  | "unknown";

export type CropSuitabilityConfidence = "low" | "medium" | "high";

export type CropSuitabilitySource =
  | "intelligence-api"
  | "nasa-power"
  | "mvp-fallback";

export interface CropSuitabilityConstraint {
  type: "temperature" | "precipitation" | "altitude" | "seasonality" | "data";
  label: string;
  value?: number;
  unit?: string;
  severity: "info" | "warning" | "critical";
}

export interface CropSuitability {
  cropId: CropId;
  status: CropSuitabilityStatus;
  score: number | null;
  confidence: CropSuitabilityConfidence;
  reasons: string[];
  constraints: CropSuitabilityConstraint[];
  source: CropSuitabilitySource;
}

export interface CropSuitabilityLocation {
  lat: number;
  lng: number;
  label?: string;
  regionId?: string;
}

export interface CropSuitabilityResponse {
  location: CropSuitabilityLocation;
  generatedAt: string;
  source: CropSuitabilitySource;
  sourceLabel: string;
  crops: CropSuitability[];
}

export interface CropSuitabilityInput {
  location: CropSuitabilityLocation;
  cropIds: CropId[];
}
