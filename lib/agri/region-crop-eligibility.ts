import { type CropId } from "@/types/crop";
import { getMvpFallbackSuitability, MVP_REGION_CROP_ALLOWLIST } from "./mvp-crop-suitability-fallback";

export const REGION_CROP_ALLOWLIST = MVP_REGION_CROP_ALLOWLIST;

export function isCropAvailable(regionId: string, cropId: CropId): boolean {
  return getMvpFallbackSuitability(regionId, cropId).status !== "unknown";
}
