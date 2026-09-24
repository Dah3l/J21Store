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

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const WHATSAPP_NUMBER = '5491112345678'; // Cambiar por el número real
