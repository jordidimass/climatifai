import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow">404 · not found</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-tight">
        Off the map.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        That coordinate doesn't lead anywhere yet. Head back to a known region.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
