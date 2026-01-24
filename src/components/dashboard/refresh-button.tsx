"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        router.refresh();
      }}
    >
      <RefreshCw className="h-4 w-4" />
      Atualizar
    </Button>
  );
}
