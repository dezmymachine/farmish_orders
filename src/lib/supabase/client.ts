import { createBrowserClient } from '@supabase/ssr';

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          organisation: string | null;
          phone: string | null;
          contact: string | null;
          location: string | null;
          role: 'customer' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          organisation?: string | null;
          phone?: string | null;
          contact?: string | null;
          location?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          organisation?: string | null;
          phone?: string | null;
          contact?: string | null;
          location?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          unit: string;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          unit?: string;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          unit?: string;
          available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered';
          delivery_address: string;
          delivery_notes: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          status?: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered';
          delivery_address: string;
          delivery_notes?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          status?: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered';
          delivery_address?: string;
          delivery_notes?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          unit: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          unit: string;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          unit?: string;
          quantity?: number;
        };
      };
    };
  };
};

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
