import { z } from "zod";

import { getCrop } from "@/lib/api/crops";
import { DEFAULT_REGION } from "@/lib/api/regions";
import { compareTwoCropsStub } from "@/lib/agri/compare-stub";

const bodySchema = z.object({
  regionId: z.string().optional(),
  /** Accept `crops: [id,id]` like future CVA-58 payload or explicit ids. */
  crops: z
    .array(z.string())
    .length(2, "Exactly two crops are required."),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().formErrors.join(" ") }, { status: 400 });
  }

  const regionId = parsed.data.regionId?.trim() || DEFAULT_REGION.id;
  const crops = parsed.data.crops.map((id) => getCrop(id)).filter(Boolean) as NonNullable<
    ReturnType<typeof getCrop>
  >[];

  if (crops.length !== 2 || crops[0]!.id === crops[1]!.id) {
    return Response.json(
      { error: "Necesitamos dos cultivos distintos del catálogo." },
      { status: 422 },
    );
  }

  const payload = compareTwoCropsStub(regionId, crops[0]!, crops[1]!);
  return Response.json(payload);
}
