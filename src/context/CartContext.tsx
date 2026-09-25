import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, DEFAULT_WHATSAPP_NUMBER } from '../types';
import { useBusiness } from './BusinessContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => boolean; // returns true if added, false if stock limit reached
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getQuantityInCart: (productId: string) => number;
  getRemainingStock: (product: Product) => number;
  generateWhatsAppMessage: () => string;
  openWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { settings } = useBusiness();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('j21-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('j21-cart', JSON.stringify(items));
  }, [items]);

  const getQuantityInCart = (productId: string): number => {
    const item = items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getRemainingStock = (product: Product): number => {
    const inCart = getQuantityInCart(product.id);
    return Math.max(0, product.stock - inCart);
  };

  const addItem = (product: Product): boolean => {
    // Verificar si hay stock disponible
    const remaining = getRemainingStock(product);
    if (remaining <= 0) {
      return false; // Stock limit reached
    }

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    return true;
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    // Obtener el producto para verificar stock
    const item = items.find(i => i.product.id === productId);
    if (!item) return;

    // Limitar al stock disponible
    const maxQuantity = item.product.stock;
    const clampedQuantity = Math.min(quantity, maxQuantity);

    setItems(prev =>
      prev.map(i =>
        i.product.id === productId ? { ...i, quantity: clampedQuantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppMessage = () => {
    let message = `🛒 *Nuevo Pedido - ${settings.business_name}*\n\n`;
    items.forEach(item => {
      message += `• ${item.product.name} (${item.product.team})\n`;
      message += `  Talla: ${item.product.size} | Cant: ${item.quantity} | $${item.product.price * item.quantity}\n\n`;
    });
    message += `💰 *Total: $${total}*\n\n`;
    message += '¡Hola! Me gustaría hacer este pedido.';
    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phone = settings.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, getQuantityInCart, getRemainingStock, generateWhatsAppMessage, openWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
