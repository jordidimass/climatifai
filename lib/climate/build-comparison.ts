import "server-only";

import { getClimateProvider } from "@/lib/data/climate-provider";
import type {
  ClimateAnalysis,
  SsPathway,
} from "@/types/climate-analysis";

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

export async function buildClimateComparison(
  lat: number,
  lon: number,
  cropId: string,
): Promise<ClimateAnalysis> {
  return buildClimateAnalysis({ lat, lon, cropId });
}
