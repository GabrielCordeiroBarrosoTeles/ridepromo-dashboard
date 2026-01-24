export interface TripRow {
  id: number;
  name: string;
  phone: string | null;
  origin: string | null;
  destination: string | null;
  app: string | null;
  valorApp: number;
  valorComDesconto: number;
  createdAt: string | null;
}
