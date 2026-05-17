import "server-only";

import { getClimateProvider } from "@/lib/data/climate-provider";
import type {
  ClimateAnalysis,
  SsPathway,
} from "@/types/climate-analysis";

/**
 * Thin orchestrator wrapper. Delegates to the configured ClimateProvider
 * (Open-Meteo direct today, ClimatifaiAPI/GraphQL once that pipeline
 * lands). The provider returns the canonical `ClimateAnalysis` shape,
 * which is what frontends + API routes should consume going forward.
 *
 * Kept as a separate entry point so future cross-cutting concerns
 * (auth, tracing, caching) can live here instead of every call site.
 */

export interface BuildClimateAnalysisInput {
  lat: number;
  lon: number;
  cropId: string;
  regionId?: string;
  scenario?: SsPathway;
  projectionRange?: { from: number; to: number };
  now?: Date;
}

export async function buildClimateAnalysis(
  input: BuildClimateAnalysisInput,
): Promise<ClimateAnalysis> {
  const provider = await getClimateProvider();
  return provider.getAnalysis(input);
}

/**
 * @deprecated Use `buildClimateAnalysis` instead. Kept for source
 * compatibility while CVA-57 wires the new shape into routes/UI.
 */
export async function buildClimateComparison(
  lat: number,
  lon: number,
  cropId: string,
): Promise<ClimateAnalysis> {
  return buildClimateAnalysis({ lat, lon, cropId });
}
