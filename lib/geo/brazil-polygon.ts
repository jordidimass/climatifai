export const BRAZIL_POLYGON: ReadonlyArray<readonly [number, number]> = [
  [-69.96, -4.2], // Tabatinga (triple border CO/PE/BR)
  [-67.0, 1.1], // Amazonas NW border w/ Colombia
  [-62.0, 3.85], // Roraima/Amazonas
  [-58.0, 4.4], // Roraima top
  [-51.0, 4.1], // Amapá (Oiapoque)
  [-48.0, -1.0], // Belém / Pará coast
  [-43.0, -2.5], // Maranhão coast
  [-36.0, -5.0], // RN coast
  [-34.8, -7.5], // Recife (easternmost mainland)
  [-37.74, -10.91], // Sergipe
  [-39.0, -15.0], // Bahia coast
  [-40.5, -20.0], // Espírito Santo
  [-43.2, -22.91], // Rio
  [-46.62, -23.55], // São Paulo
  [-48.5, -27.0], // Santa Catarina
  [-50.5, -30.3], // Rio Grande do Sul coast
  [-53.78, -33.74], // Chuí (southern tip)
  [-56.0, -30.5], // Uruguay border
  [-57.65, -27.5], // Argentina border (Misiones)
  [-54.62, -25.59], // Foz do Iguaçu
  [-57.65, -22.4], // Paraguay border
  [-58.0, -20.0], // MS / Paraguay
  [-60.5, -16.5], // Bolivia border
  [-65.3, -10.78], // Rondônia / Bolivia
  [-69.55, -10.95], // Acre / Bolivia
  [-72.96, -9.41], // SW Acre
  [-73.99, -7.5], // Acre west
  [-72.0, -7.5], // Amazonas SW
];

export function pointInPolygon(
  lng: number,
  lat: number,
  polygon: ReadonlyArray<readonly [number, number]> = BRAZIL_POLYGON,
): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
