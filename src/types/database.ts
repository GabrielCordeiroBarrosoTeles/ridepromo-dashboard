export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: {
          id: number;
          origin: string | null;
          destination: string | null;
          app: string | null;
          timestamp: number | null;
          user_id: string | null;
          discount_percent: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["trips"]["Row"], "id"> & { id?: number };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
      };
      ride_options: {
        Row: {
          id: number;
          trip_id: number;
          type: string | null;
          name: string | null;
          price: string | null;
          value: number | null;
          estimated_time: string | null;
          driver_value_per_km: number | null;
          driver_value_per_hour: number | null;
          pickup_km: number | null;
          trip_km: number | null;
          total_km: number | null;
          pickup_min: number | null;
          trip_duration_min: number | null;
          total_min: number | null;
          meets_min_per_km: boolean | null;
          meets_min_per_hour: boolean | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["ride_options"]["Row"], "id"> & { id?: number };
        Update: Partial<Database["public"]["Tables"]["ride_options"]["Insert"]>;
      };
      users: {
        Row: {
          id_user: string;
          id_customer: string | null;
          name_user: string | null;
          nickname: string | null;
          email: string | null;
          phone: string | null;
          document: string | null;
          customer_register_status_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Database["public"]["Tables"]["users"]["Row"];
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      app_logs: {
        Row: {
          id: number;
          log_code: string;
          count: number;
          user_id: string | null;
          created_at: string | null;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["app_logs"]["Row"], "id"> & { id?: number };
        Update: Partial<Database["public"]["Tables"]["app_logs"]["Insert"]>;
      };
      config: {
        Row: {
          key: string;
          value: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Database["public"]["Tables"]["config"]["Row"];
        Update: Partial<Database["public"]["Tables"]["config"]["Insert"]>;
      };
      opt_outs: {
        Row: {
          id: number;
          user_id: string | null;
          device_model: string | null;
          app_version: string | null;
          app_name: string | null;
          occurred_at: string | null;
          created_at: string | null;
          trip_id: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["opt_outs"]["Row"], "id"> & { id?: number };
        Update: Partial<Database["public"]["Tables"]["opt_outs"]["Insert"]>;
      };
    };
  };
}
