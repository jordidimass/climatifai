import type { Metadata } from "next";

import { FlowHeader } from "@/components/layout/flow-header";
import { FireMapChrome } from "@/components/map/fire-map-chrome";

export const metadata: Metadata = {
  title: "Selector en mapa · incendios",
};

export default function MapaIncendiosSeleccionPage() {
  return (
    <>
      <FlowHeader title="Selector en mapa" backHref="/mapa-incendios" />
      <FireMapChrome phase="select" className="flex-1" />
    </>
  );
}
