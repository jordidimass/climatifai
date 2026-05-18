import { Suspense } from "react";

import { FireMapChrome } from "@/components/map/fire-map-chrome";

export default function FiresSelectPage() {
  return (
    <Suspense fallback={null}>
      <FireMapChrome phase="select" className="flex-1" />
    </Suspense>
  );
}
