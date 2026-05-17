import "server-only";

import type {
  ClimateProvider,
  GetAnalysisInput,
} from "@/lib/data/climate-provider";
import type { ClimateAnalysis } from "@/types/climate-analysis";

/**
 * Future ClimatifaiAPI provider. Will hit the org's own GraphQL endpoint
 * (FastAPI/Graphene) once the ingestion + normalization pipeline is
 * live. Today it throws so the env-switch is wired but the implementation
 * surface stays explicitly empty — no silent fallback that hides the gap.
 */

export class ClimatifaiProvider implements ClimateProvider {
  readonly id = "climatifai" as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAnalysis(_input: GetAnalysisInput): Promise<ClimateAnalysis> {
    throw new Error(
      "ClimatifaiProvider not implemented yet. The internal GraphQL " +
        "ClimatifaiAPI is not online; set CLIMATE_PROVIDER=open-meteo " +
        "until the pipeline lands.",
    );
  }
}
