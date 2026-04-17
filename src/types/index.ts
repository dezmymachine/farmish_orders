export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  available: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product | null;
  quantity: number;
  custom_name?: string;
  custom_unit?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  delivery_address: string;
  delivery_notes?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit: string;
  quantity: number;
}

export interface Profile {
  id: string;
  full_name?: string | null;
  organisation?: string | null;
  phone?: string | null;
  contact?: string | null;
  location?: string | null;
  role: 'customer' | 'admin';
}

export interface Quote {
  id: string;
  order_id: string;
  total_amount: number;
  service_fee?: number;
  transport?: number;
  created_at: string;
  quote_items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  order_item_id: string;
  product_name?: string;
  custom_price?: number;
  unit_price?: number;
  quantity: number;
  total_price: number;
  district?: string;
}
