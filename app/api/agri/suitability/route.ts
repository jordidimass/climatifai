import { z } from "zod";

import { isCropId } from "@/lib/api/crops";
import { getCropSuitability } from "@/lib/agri/crop-suitability";
import type { CropId } from "@/types/crop";

const bodySchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    label: z.string().optional(),
    regionId: z.string().optional(),
  }),
  cropIds: z.array(z.string().refine(isCropId, "cultivo inválido")).min(1),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "cuerpo inválido", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const response = await getCropSuitability({
    location: parsed.data.location,
    cropIds: parsed.data.cropIds as CropId[],
  });

  return Response.json(response);
}
