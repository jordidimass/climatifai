import type { Metadata } from "next";

import { FlowHeader } from "@/components/layout/flow-header";
import { FireMapChrome } from "@/components/map/fire-map-chrome";

export const metadata: Metadata = {
  title: "Mapa de incendios",
};

export default function MapaIncendiosPage() {
  return (
    <>
      <FlowHeader title="Mapa de incendios" />
      <FireMapChrome phase="browse" className="flex-1" />
    </>
  );
}
