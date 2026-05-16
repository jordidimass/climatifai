/**
 * Deterministic demo analytics keyed by region + crop — until live APIs plug in.
 */

export function deriveStats(regionId: string, cropId: string) {
  const seed = (regionId + cropId)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const wave = (n: number) => ((seed * 9301 + n * 49297) % 233280) / 233280;

  const tempDelta = +(0.8 + wave(1) * 1.6).toFixed(1);
  const precipDelta = +(-20 + wave(2) * 14).toFixed(0);
  const gdd = Math.round(1100 + wave(3) * 320);
  const heatStress = Math.round(14 + wave(4) * 22);

  /** Rough composite risk 0–100 for pairing views (stub). */
  const riskScore = Math.min(
    100,
    Math.round(
      38 +
        Math.abs(tempDelta) * 12 +
        Math.abs(precipDelta) * 0.35 +
        (heatStress - 14) * 1.2,
    ),
  );

  return { tempDelta, precipDelta, gdd, heatStress, riskScore };
}

/** Label for demo risk tiers (riskScore 0–100, lower better). */
export function riskStressLabel(score: number): {
  label: string;
  tone: "low" | "moderate" | "high";
} {
  if (score >= 65) return { label: "Alto", tone: "high" };
  if (score >= 45) return { label: "Moderado", tone: "moderate" };
  return { label: "Bajo–moderado", tone: "low" };
}
