import { Suspense } from "react";

import { FireMapChrome } from "@/components/map/fire-map-chrome";

export default function FiresPage() {
  return (
    <Suspense fallback={null}>
      <FireMapChrome phase="browse" className="flex-1" />
    </Suspense>
  );
}
