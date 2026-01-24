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
    };
  };
}
