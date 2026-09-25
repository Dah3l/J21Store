export interface ProductVariant {
  id: string;
  product_id: string;
  player_name: string;
  sizes: string[];
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPlayer?: string;
  selectedSize?: string;
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

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const DEFAULT_WHATSAPP_NUMBER = '5491112345678'; // Fallback

// Zonas de entrega por defecto (se cargan desde Supabase si existen)
export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { id: '1', name: 'La Habana Vieja', price: 1200, created_at: '' },
  { id: '2', name: 'Centro Habana', price: 1500, created_at: '' },
  { id: '3', name: 'Vedado', price: 2500, created_at: '' },
  { id: '4', name: 'Cerro', price: 2500, created_at: '' },
  { id: '5', name: 'Marianao', price: 3000, created_at: '' },
  { id: '6', name: 'La Lisa', price: 3500, created_at: '' },
  { id: '7', name: 'Santa Fe', price: 4000, created_at: '' },
  { id: '8', name: 'Casa Blanca', price: 1200, created_at: '' },
  { id: '9', name: 'Habana del Este', price: 1800, created_at: '' },
  { id: '10', name: 'Cojímar', price: 1800, created_at: '' },
  { id: '11', name: 'Bahía', price: 1000, created_at: '' },
  { id: '12', name: 'Alamar', price: 2500, created_at: '' },
  { id: '13', name: 'Guanabo', price: 4500, created_at: '' },
  { id: '14', name: 'Guanabacoa', price: 2000, created_at: '' },
  { id: '15', name: 'Compro Florido', price: 4500, created_at: '' },
  { id: '16', name: 'Cotorro', price: 3000, created_at: '' },
  { id: '17', name: 'San Miguel', price: 2000, created_at: '' },
  { id: '18', name: 'Diezmero', price: 2500, created_at: '' },
  { id: '19', name: 'Arroyo Naranjo', price: 2500, created_at: '' },
  { id: '20', name: 'Managua', price: 3500, created_at: '' },
  { id: '21', name: 'Boyeros', price: 4500, created_at: '' },
  { id: '22', name: 'Santiago de las Vegas', price: 5000, created_at: '' },
  { id: '23', name: 'Cujae', price: 2800, created_at: '' },
  { id: '24', name: '10 de Octubre', price: 2000, created_at: '' },
  { id: '25', name: 'Luyano', price: 1500, created_at: '' },
  { id: '26', name: 'Virgen del Camino', price: 1200, created_at: '' },
];

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
