export interface Product {
  id: string;
  name: string;
  team: string;
  size: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  description: string;
  updated_at: string;
}

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const DEFAULT_WHATSAPP_NUMBER = '5491112345678'; // Fallback

// Valores por defecto si no hay configuración en Supabase
export const DEFAULT_SETTINGS: BusinessSettings = {
  id: 'default',
  business_name: 'J21 Store',
  whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
  email: 'contacto@j21store.com',
  address: '',
  instagram: '',
  facebook: '',
  description: 'Tu tienda de camisetas de fútbol',
  updated_at: '',
};
