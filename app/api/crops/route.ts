import { CROPS } from "@/lib/api/crops";

export async function GET() {
  return Response.json({ crops: CROPS });
}
