import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, DEFAULT_WHATSAPP_NUMBER } from '../types';
import { useBusiness } from './BusinessContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, player?: string, size?: string) => boolean;
  removeItem: (productId: string, player?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, player?: string, size?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getQuantityInCart: (productId: string, player?: string, size?: string) => number;
  getRemainingStock: (product: Product, player?: string, size?: string) => number;
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

  // Helper para crear clave única de item (producto + jugador + talla)
  const getItemKey = (productId: string, player?: string, size?: string): string => {
    return `${productId}-${player || ''}-${size || ''}`;
  };

  const getQuantityInCart = (productId: string, player?: string, size?: string): number => {
    const key = getItemKey(productId, player, size);
    const item = items.find(i => getItemKey(i.product.id, i.selectedPlayer, i.selectedSize) === key);
    return item ? item.quantity : 0;
  };

  const getRemainingStock = (product: Product, player?: string, size?: string): number => {
    const inCart = getQuantityInCart(product.id, player, size);
    
    // Si hay jugador seleccionado, usar el stock de la variante
    if (player && product.variants) {
      const variant = product.variants.find(v => v.player_name === player);
      if (variant) {
        return Math.max(0, (variant.stock || 0) - inCart);
      }
    }
    
    // Fallback al stock global del producto
    return Math.max(0, product.stock - inCart);
  };

  const addItem = (product: Product, player?: string, size?: string): boolean => {
    // Verificar si hay stock disponible
    const remaining = getRemainingStock(product, player, size);
    if (remaining <= 0) {
      return false; // Stock limit reached
    }

    setItems(prev => {
      const key = getItemKey(product.id, player, size);
      const existing = prev.find(item => getItemKey(item.product.id, item.selectedPlayer, item.selectedSize) === key);
      
      if (existing) {
        return prev.map(item =>
          getItemKey(item.product.id, item.selectedPlayer, item.selectedSize) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedPlayer: player, selectedSize: size }];
    });
    return true;
  };

  const removeItem = (productId: string, player?: string, size?: string) => {
    const key = getItemKey(productId, player, size);
    setItems(prev => prev.filter(item => getItemKey(item.product.id, item.selectedPlayer, item.selectedSize) !== key));
  };

  const updateQuantity = (productId: string, quantity: number, player?: string, size?: string) => {
    const key = getItemKey(productId, player, size);
    
    if (quantity <= 0) {
      removeItem(productId, player, size);
      return;
    }

    // Obtener el producto para verificar stock
    const item = items.find(i => getItemKey(i.product.id, i.selectedPlayer, i.selectedSize) === key);
    if (!item) return;

    // Determinar el stock máximo basado en la variante
    let maxQuantity = item.product.stock;
    if (player && item.product.variants) {
      const variant = item.product.variants.find(v => v.player_name === player);
      if (variant) {
        maxQuantity = variant.stock || 0;
      }
    }

    // Limitar al stock disponible
    const clampedQuantity = Math.min(quantity, maxQuantity);

    setItems(prev =>
      prev.map(i =>
        getItemKey(i.product.id, i.selectedPlayer, i.selectedSize) === key ? { ...i, quantity: clampedQuantity } : i
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
      if (item.selectedPlayer) {
        message += `  Jugador: ${item.selectedPlayer}\n`;
      }
      if (item.selectedSize) {
        message += `  Talla: ${item.selectedSize}`;
      }
      message += ` | Cant: ${item.quantity} | $${item.product.price * item.quantity}\n\n`;
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
