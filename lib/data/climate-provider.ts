import "server-only";

import type {
  ClimateAnalysis,
  ProviderId,
  SsPathway,
} from "@/types/climate-analysis";

/**
 * Provider abstraction for the climate-analysis pipeline.
 *
 * Frontend + API routes call `getClimateProvider().getAnalysis(...)`.
 * Today the only working implementation hits Open-Meteo directly. Once
 * the ClimatifaiAPI (GraphQL/FastAPI) lands, swap by setting
 * `CLIMATE_PROVIDER=climatifai` — no consumer changes required.
 */

export interface GetAnalysisInput {
  lat: number;
  lon: number;
  cropId: string;
  regionId?: string;
  /** Inclusive year range for the projection block. Defaults to 2026–2030. */
  projectionRange?: { from: number; to: number };
  scenario?: SsPathway;
  /** Optional override (testing). */
  now?: Date;
}

export interface ClimateProvider {
  readonly id: ProviderId;
  getAnalysis(input: GetAnalysisInput): Promise<ClimateAnalysis>;
}

let cached: ClimateProvider | null = null;

export async function getClimateProvider(): Promise<ClimateProvider> {
  if (cached) return cached;
  const choice = (process.env.CLIMATE_PROVIDER ?? "open-meteo").toLowerCase();
  if (choice === "climatifai") {
    const { ClimatifaiProvider } = await import(
      "@/lib/data/providers/climatifai"
    );
    cached = new ClimatifaiProvider();
  } else {
    const { OpenMeteoProvider } = await import(
      "@/lib/data/providers/open-meteo"
    );
    cached = new OpenMeteoProvider();
  }
  return cached;
}
