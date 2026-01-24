export interface RideOptionRow {
  type: string | null;
  name: string | null;
  price: string | null;
  value: number | null;
  estimatedTime: string | null;
}

export interface TripRow {
  id: number;
  name: string;
  phone: string | null;
  origin: string | null;
  destination: string | null;
  app: string | null;
  valorApp: number;
  valorComDesconto: number;
  /** Percentual de desconto salvo (9–11). Null para viagens antigas → fallback 20% no modal. */
  discountPercent: number | null;
  createdAt: string | null;
  rides: RideOptionRow[];
}
