import type { Metadata } from "next";

import { FireMapChrome } from "@/components/map/fire-map-chrome";

export const metadata: Metadata = {
  title: "Mapa de incendios",
};

export default function MapaIncendiosPage() {
  return <FireMapChrome phase="browse" className="flex-1" />;
}
