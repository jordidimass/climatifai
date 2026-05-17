import type { Metadata } from "next";

import { FireMapChrome } from "@/components/map/fire-map-chrome";

export const metadata: Metadata = {
  title: "Selector en mapa · incendios",
};

export default function MapaIncendiosSeleccionPage() {
  return <FireMapChrome phase="select" className="flex-1" />;
}
