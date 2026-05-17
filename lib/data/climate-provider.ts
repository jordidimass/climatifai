import "server-only";

import type {
  ClimateAnalysis,
  ProviderId,
  SsPathway,
} from "@/types/climate-analysis";

export interface GetAnalysisInput {
  lat: number;
  lon: number;
  cropId: string;
  regionId?: string;

  projectionRange?: { from: number; to: number };
  scenario?: SsPathway;

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
