// Common interfaces for type safety

export interface TripData {
  rows: TripRow[];
  total: number;
}

export interface RideOptionRow {
  type: string | null;
  name: string | null;
  price: string | null;
  value: number | null;
  estimatedTime: string | null;
  /** R$/km do motorista */
  driverValuePerKm: number | null;
  /** R$/h do motorista */
  driverValuePerHour: number | null;
  pickupKm: number | null;
  tripKm: number | null;
  totalKm: number | null;
  pickupMin: number | null;
  tripDurationMin: number | null;
  totalMin: number | null;
  meetsMinPerKm: boolean | null;
  meetsMinPerHour: boolean | null;
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

export interface DriverConfig {
  rate_per_km: number;
  rate_per_hour: number;
  minimum_fare: number;
  [key: string]: any;
}

export interface ViagensPageData {
  tripData: TripData;
  driverConfig: DriverRateConfigRow;
}

export interface ClienteRow {
  id_user: string;
  name_user: string | null;
  phone: string | null;
  email: string | null;
  /** Quantidade de viagens (soma de todos os apps). */
  trip_count: number;
}

export interface OptOutRow {
  id: number;
  user_id: string | null;
  device_model: string | null;
  app_version: string | null;
  app_name: string | null;
  occurred_at: string | null;
  created_at: string | null;
  trip_id: number | null;
  /** Nome do cliente (users.name_user). */
  client_name: string | null;
  /** Viagem vinculada: origem → destino. */
  trip_origin: string | null;
  trip_destination: string | null;
  trip_app: string | null;
  trip_created_at: string | null;
}

export interface LogData {
  logs: AppLogRow[];
  userNameByUserId: Record<string, string>;
  userPhoneByUserId: Record<string, string>;
  tripCountByUserId: Record<string, number>;
}

export interface AppLogRow {
  id: number;
  log_code: string;
  count: number;
  user_id: string | null;
  created_at: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ConfigRow {
  key: string;
  value: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Valores mínimos R$/km e R$/h da configuração (carro e moto) para exibir no modal de detalhes. */
export interface DriverRateConfigRow {
  minPerKmCar: number;
  minPerKmMoto: number;
  minPerHourCar: number;
  minPerHourMoto: number;
}