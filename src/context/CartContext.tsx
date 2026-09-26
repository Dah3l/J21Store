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
    
    // Si es producto por encargo, stock ilimitado
    if (product.is_preorder) {
      return 999; // Stock "infinito" para productos por encargo
    }
    
    // Usar el stock de la variante
    if (player && product.variants) {
      const variant = product.variants.find(v => v.player_name === player);
      if (variant) {
        return Math.max(0, (variant.stock || 0) - inCart);
      }
    }
    
    // Si no hay variante o jugador, no hay stock disponible
    return 0;
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
    let maxQuantity = 0;
    
    // Si es producto por encargo, stock ilimitado
    if (item.product.is_preorder) {
      maxQuantity = 999;
    } else if (player && item.product.variants) {
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
    message += `📦 *Productos:*\n`;
    
    items.forEach(item => {
      const isPreorder = item.product.is_preorder || false;
      const deliveryDays = item.product.delivery_days || 7;
      
      message += `• ${item.product.name} (${item.product.team})`;
      if (isPreorder) {
        message += ` 🕐 *POR ENCARGO*`;
      }
      message += `\n`;
      
      if (item.selectedPlayer) {
        message += `  👤 Jugador: ${item.selectedPlayer}\n`;
      }
      if (item.selectedSize) {
        message += `  📏 Talla: ${item.selectedSize}\n`;
      }
      message += `  📊 Cantidad: ${item.quantity}\n`;
      message += `  💵 Precio: $${item.product.price} USD c/u\n`;
      message += `  💰 Subtotal: $${item.product.price * item.quantity} USD\n`;
      if (isPreorder) {
        message += `  🚚 Entrega: ${deliveryDays} días\n`;
      }
      message += `\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *Total: $${total} USD*\n\n`;
    message += '¡Hola! Me gustaría hacer este pedido.';
    
    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phone = settings.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;
    
    // Asegurar que el número tenga el formato correcto (con + al inicio)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // En móvil, usar el esquema whatsapp:// con formato correcto
      // El formato correcto es: whatsapp://send?phone=+XXXXXXXXX&text=mensaje
      const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${message}`;
      
      // Intentar abrir con el esquema nativo primero
      window.location.href = whatsappUrl;
      
      // Fallback: si después de 2.5 segundos no se abrió, usar wa.me
      setTimeout(() => {
        if (!document.hidden) {
          window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        }
      }, 2500);
    } else {
      // En desktop, usar wa.me normalmente
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
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
