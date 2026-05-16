import "server-only";

import type { ClimateSeries, TimeRange } from "@/types/climate";

/**
 * Generates a deterministic synthetic climate series so the UI is
 * testable before a real climate provider (NASA POWER, Open-Meteo
 * Historical, Copernicus C3S) is wired in. Identical inputs always
 * produce identical output — important for caching and tests.
 *
 * TODO: replace with a real fetcher. The likely candidates are:
 *  - NASA POWER (free, monthly resolution, global)
 *  - Open-Meteo Historical Weather API (free, daily, easy)
 *  - Copernicus C3S (richer, requires registration)
 */
export async function fetchClimateSeries(
  regionId: string,
  cropId: string,
  range: TimeRange,
  kind: ClimateSeries["kind"],
): Promise<ClimateSeries> {
  const months = enumerateMonths(range);
  const seedBase = hash(`${regionId}:${cropId}:${kind}`);

  const points = months.map((month, i) => {
    const angle = ((i % 12) / 12) * Math.PI * 2;
    // Mediterranean-ish seasonal curve (warm summer, cool winter).
    const baseTemp = 15 + Math.cos(angle - Math.PI) * 10;
    const drift = kind === "projected" ? 1.6 : 0;
    const noise = ((seedBase + i * 9301) % 100) / 100;

    return {
      month,
      tempMeanC: +(baseTemp + drift + (noise - 0.5) * 1.2).toFixed(2),
      precipMm: Math.max(
        0,
        Math.round(
          (50 + Math.sin(angle) * -30) * (kind === "projected" ? 0.88 : 1) +
            noise * 18,
        ),
      ),
      gdd: Math.max(
        0,
        Math.round(Math.max(0, baseTemp - 4) * 30 + (kind === "projected" ? 24 : 0)),
      ),
    };
  });

  return { regionId, cropId, range, kind, points };
}

function enumerateMonths({ from, to }: TimeRange): string[] {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  const months: string[] = [];
  let y = fy;
  let m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    months.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return months;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}
