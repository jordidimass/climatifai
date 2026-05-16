"use client";

import { Sunset } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function HarvestExtras() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-2 rounded-full"
      onClick={() =>
        toast.message("Pronto", {
          description:
            "Horarios de ocaso y fotoperíodo para tu ventana de cosecha.",
        })
      }
    >
      <Sunset className="size-4" aria-hidden />
      Ocaso solar
    </Button>
  );
}
