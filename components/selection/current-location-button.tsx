"use client";

import { Loader2, LocateFixed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentLocation } from "@/hooks/use-current-location";
import { cn } from "@/lib/utils";

interface CurrentLocationButtonProps {
  className?: string;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function CurrentLocationButton({
  className,
  label = "Mi ubicación",
  variant = "outline",
  size = "sm",
}: CurrentLocationButtonProps) {
  const { request, requesting } = useCurrentLocation();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={request}
      disabled={requesting}
      aria-label={label}
      className={cn("gap-1.5 rounded-full", className)}
    >
      {requesting ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <LocateFixed className="size-3.5" aria-hidden />
      )}
      {label}
    </Button>
  );
}
