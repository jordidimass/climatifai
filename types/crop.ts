export const CROP_IDS = [
  "maize",
  "bean",
  "coffee",
  "cacao",
  "rice",
  "sugarcane",
  "tomato",
  "potato",
  "avocado",
  "chile",
  "banana",
  "sorghum",
  "cassava",
  "cardamom",
] as const;

export type CropId = (typeof CROP_IDS)[number];

export interface Crop {
  id: CropId;
  name: string;
  iconEmoji: string;
  scientificName: string;

  gddBaseC: number;

  idealPrecipMm: { min: number; max: number };

  heatStressC: number;

  tagline: string;
}
