"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight">
        Unexpected turbulence.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The page tripped on an error. Try again, or reload from the home page.
      </p>
      <p className="numeric mt-4 text-[10px] text-muted-foreground/70">
        {error.digest ? `ref: ${error.digest}` : null}
      </p>
      <Button onClick={reset} className="mt-6 rounded-full">
        Try again
      </Button>
    </div>
  );
}
