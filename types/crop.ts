export interface Crop {
  id: string;
  name: string;
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
