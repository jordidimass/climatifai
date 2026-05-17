import { Suspense } from "react";
import type { Metadata } from "next";

import { FireMapChrome } from "@/components/map/fire-map-chrome";

export const metadata: Metadata = {
  title: "Selector en mapa · incendios",
};

export default function MapaIncendiosSeleccionPage() {
  return (
    <Suspense fallback={null}>
      <FireMapChrome phase="select" className="flex-1" />
    </Suspense>
  );
}
