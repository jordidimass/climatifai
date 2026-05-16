import type { Crop } from "@/types/crop";

import { deriveStats, riskStressLabel } from "@/lib/dashboard-stats";

export type AgriCompareResult = {
  preferred_crop: string;
  preferred_crop_name: string;
  reason: string;
  scores: Record<string, number>;
};

/**
 * MVP compare logic aligned with deterministic demo metrics.
 * Later wire to upstream `POST /agri/compare` (CVA-58).
 */
export function compareTwoCropsStub(
  regionId: string,
  a: Crop,
  b: Crop,
): AgriCompareResult {
  const sA = deriveStats(regionId, a.id);
  const sB = deriveStats(regionId, b.id);
  const preferA = sA.riskScore <= sB.riskScore;
  const preferred = preferA ? a : b;
  const other = preferA ? b : a;
  const sP = preferA ? sA : sB;
  const sO = preferA ? sB : sA;
  const sevP = riskStressLabel(sP.riskScore);
  const sevO = riskStressLabel(sO.riskScore);

  const precipNote =
    sP.precipDelta < sO.precipDelta
      ? `${preferred.name} presiona menos la sequía proyectada (${sP.precipDelta}% vs ${sO.precipDelta}%). `
      : ``;
  const tempNote =
    Math.abs(sP.tempDelta - sO.tempDelta) > 0.15
      ? `Estrés térmico combinado algo más contenido (${sP.tempDelta.toFixed(1)}°C vs ${sO.tempDelta.toFixed(1)}°C Δ). `
      : "";

  const reason =
    `${preferred.name} queda mejor posicionado con score compuesto menor (${sP.riskScore}/100, ${sevP.label}) frente a ${other.name} (${sO.riskScore}/100, ${sevO.label}). ` +
    precipNote +
    tempNote +
    `Validá con campo, rendimiento económico y datos reales antes de cerrar temporada.`;

  return {
    preferred_crop: preferred.id,
    preferred_crop_name: preferred.name,
    reason,
    scores: {
      [`${a.id}`]: sA.riskScore,
      [`${b.id}`]: sB.riskScore,
    },
  };
}
