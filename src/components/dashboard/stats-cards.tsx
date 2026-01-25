import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeBR } from "@/lib/utils";
import { MapPin, Users, Clock, UserMinus } from "lucide-react";

interface StatsCardsProps {
  totalTrips: number;
  totalUsers: number;
  lastTripAt: string | null;
  isUniqueTrips?: boolean;
  totalOptOuts?: number;
}

function formatLastTrip(s: string | null): string {
  return formatDateTimeBR(s);
}

export function StatsCards({ totalTrips, totalUsers, lastTripAt, isUniqueTrips = false, totalOptOuts = 0 }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link href="/viagens" className="block transition hover:opacity-90">
        <Card className="cursor-pointer transition hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viagens</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTrips.toLocaleString("pt-BR")}</p>
            {isUniqueTrips && <p className="text-xs text-muted-foreground">origem+destino+dia únicos</p>}
            {!isUniqueTrips && <p className="text-xs text-muted-foreground">clique para listar</p>}
          </CardContent>
        </Card>
      </Link>
      <Link href="/clientes" className="block transition hover:opacity-90">
        <Card className="cursor-pointer transition hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes (com login)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">clique para listar</p>
          </CardContent>
        </Card>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Última viagem</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{formatLastTrip(lastTripAt)}</p>
        </CardContent>
      </Card>
      <Link href="/desistencias" className="block transition hover:opacity-90">
        <Card className="cursor-pointer transition hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desistências</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOptOuts.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">clique para listar</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
