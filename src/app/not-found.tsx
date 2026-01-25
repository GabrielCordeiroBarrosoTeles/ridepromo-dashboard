import Link from "next/link";
import { CarFront, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#fd6c13] text-white shadow-lg">
          <CarFront className="h-10 w-10" />
        </div>
        
        <h1 className="text-6xl font-bold text-[#fd6c13] mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida para outro local.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#fd6c13] hover:bg-[#e55f0f]">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ir para início
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </main>
  );
}