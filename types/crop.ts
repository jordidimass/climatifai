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
  /** Base temperature in °C for Growing Degree Day calculations. */
  gddBaseC: number;
  /** Comfortable annual precipitation range in mm. */
  idealPrecipMm: { min: number; max: number };
  /** Daily-max temperature beyond which the crop suffers heat stress. */
  heatStressC: number;
  /** Short tagline shown in pickers. */
  tagline: string;
}
