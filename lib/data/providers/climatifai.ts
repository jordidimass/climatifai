import "server-only";

import type {
  ClimateProvider,
  GetAnalysisInput,
} from "@/lib/data/climate-provider";
import type { ClimateAnalysis } from "@/types/climate-analysis";

export class ClimatifaiProvider implements ClimateProvider {
  readonly id = "climatifai" as const;

  async getAnalysis(input: GetAnalysisInput): Promise<ClimateAnalysis> {
    void input;
    throw new Error(
      "ClimatifaiProvider not implemented yet. The internal GraphQL " +
        "ClimatifaiAPI is not online; set CLIMATE_PROVIDER=open-meteo " +
        "until the pipeline lands.",
    );
  }
}
