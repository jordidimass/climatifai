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
    id: "bean-rainfed",
    label: "Frijol · secano",
    cropId: "bean",
    modalityId: "rainfed",
    modalityLabel: "Secano",
  },
  {
    id: "rice-irrigated",
    label: "Arroz · con riego",
    cropId: "rice",
    modalityId: "standard",
    modalityLabel: "Riego",
  },
  {
    id: "coffee-altitude",
    label: "Café · altitud media",
    cropId: "coffee",
    modalityId: "altitude",
    modalityLabel: "Altitud media",
  },
  {
    id: "cacao-shade",
    label: "Cacao · sombra húmeda",
    cropId: "cacao",
    modalityId: "shade",
    modalityLabel: "Sombra",
  },
] as const;

export type SowingPresetId = (typeof SOWING_PRESETS)[number]["id"];

export function getSowingPreset(id: string) {
  return SOWING_PRESETS.find((p) => p.id === id);
}
