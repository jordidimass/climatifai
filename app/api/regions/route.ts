import { REGIONS } from "@/lib/api/regions";

export async function GET() {
  return Response.json({ regions: REGIONS });
}
