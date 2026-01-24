"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      className="bg-white text-[#fd6c13] border-white/80 hover:bg-white/95 hover:text-[#e55c0a] hover:border-white"
    >
      <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Atualizando…" : "Atualizar"}
    </Button>
  );
}
