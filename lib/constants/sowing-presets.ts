/**
 * Opciones de “tipo de siembra” para el formulario MVP: combinan cultivo y modalidad.
 */
export const SOWING_PRESETS = [
  {
    id: "maize-rainfed",
    label: "Maíz · secano",
    cropId: "maize",
    modalityId: "rainfed",
    modalityLabel: "Secano",
  },
  {
    id: "maize-irrigated",
    label: "Maíz · con riego",
    cropId: "maize",
    modalityId: "irrigated",
    modalityLabel: "Riego",
  },
  {
    id: "soybean-rainfed",
    label: "Soya · secano",
    cropId: "soybean",
    modalityId: "rainfed",
    modalityLabel: "Secano",
  },
  {
    id: "wheat-standard",
    label: "Trigo · siembra estándar",
    cropId: "wheat",
    modalityId: "standard",
    modalityLabel: "Estándar",
  },
  {
    id: "coffee-altitude",
    label: "Café · altitud media",
    cropId: "coffee",
    modalityId: "altitude",
    modalityLabel: "Altitud media",
  },
  {
    id: "vineyard-dry",
    label: "Vid · viticultura seca",
    cropId: "vineyard",
    modalityId: "dry_farmed",
    modalityLabel: "Seca",
  },
] as const;

export type SowingPresetId = (typeof SOWING_PRESETS)[number]["id"];

export function getSowingPreset(id: string) {
  return SOWING_PRESETS.find((p) => p.id === id);
}
