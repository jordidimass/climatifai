import { z } from "zod";

import { fetchClimateSeries } from "@/lib/api/climate";

const querySchema = z.object({
  regionId: z.string().min(1),
  cropId: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}$/, "se esperaba YYYY-MM"),
  to: z.string().regex(/^\d{4}-\d{2}$/, "se esperaba YYYY-MM"),
  scenario: z
    .enum(["ssp1-2.6", "ssp2-4.5", "ssp3-7.0", "ssp5-8.5"])
    .default("ssp3-7.0"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    regionId: searchParams.get("regionId"),
    cropId: searchParams.get("cropId"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    scenario: searchParams.get("scenario") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "consulta inválida", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { regionId, cropId, from, to, scenario } = parsed.data;
  const series = await fetchClimateSeries(
    regionId,
    cropId,
    { from, to },
    "projected",
  );
  return Response.json({ ...series, scenario });
}
