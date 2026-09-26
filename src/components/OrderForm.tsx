import { useState } from 'react';
import { CartItem, DEFAULT_WHATSAPP_NUMBER } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { useDelivery } from '../context/DeliveryContext';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSuccess: () => void;
}

export default function OrderForm({ isOpen, onClose, items, total, onSuccess }: OrderFormProps) {
  const { settings } = useBusiness();
  const { zones } = useDelivery();
  const [name, setName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Bloquear scroll cuando el modal está abierto
  useModalScrollLock(isOpen);

  // Calcular precio de envío
  const getDeliveryPrice = () => {
    if (selectedZone === 'other') return 0; // Dirección personalizada, precio a definir
    const zone = zones.find(z => z.id === selectedZone);
    return zone ? zone.price : 0;
  };

  const deliveryPrice = getDeliveryPrice();

  const generateMessage = () => {
    const zone = zones.find(z => z.id === selectedZone);
    const finalAddress = selectedZone === 'other' 
      ? customAddress 
      : zone?.name || '';

    let message = `🛒 *Nuevo Pedido - ${settings.business_name}*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Dirección:* ${finalAddress}\n`;
    message += `🕐 *Hora de retiro:* ${pickupTime}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 *PRODUCTOS:*\n\n`;
    
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
    message += `💵 *Total Productos: $${total} USD*\n\n`;
    
    if (deliveryPrice > 0) {
      message += `🚚 *Envío (${zone?.name}): $${deliveryPrice} CUP*\n\n`;
    } else if (selectedZone === 'other') {
      message += `🚚 *Envío: A coordinar*\n\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *RESUMEN:*\n`;
    message += `• Productos: $${total} USD\n`;
    if (deliveryPrice > 0) {
      message += `• Envío: $${deliveryPrice} CUP\n`;
    }
    message += `\n¡Hola! Me gustaría hacer este pedido.`;
    
    if (notes.trim()) {
      message += `\n\n📝 *Notas:* ${notes}`;
    }

    return message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const phone = settings.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;
    
    // Asegurar que el número tenga el formato correcto (con + al inicio)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // En móvil, usar el esquema whatsapp:// con formato correcto
      const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
      window.location.href = whatsappUrl;
      
      // Fallback: si después de 2.5 segundos no se abrió, usar wa.me
      setTimeout(() => {
        if (!document.hidden) {
          window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        }
      }, 2500);
    } else {
      // En desktop, usar wa.me normalmente
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    }
    
    // Limpiar formulario y cerrar
    setName('');
    setSelectedZone('');
    setCustomAddress('');
    setPickupTime('');
    setNotes('');
    setSubmitting(false);
    
    // Llamar al callback de éxito (limpiar carrito)
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img 
                  src="https://fwempizdkfvorzfzjgtg.supabase.co/storage/v1/object/public/jerseys/products/1790305089491-hn6warfj9cb.jpg"
                  alt="Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">Finalizar Pedido</h2>
                  <p className="text-zinc-400 text-sm mt-1">Completá tus datos para continuar</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm">Productos:</span>
                <span className="text-white text-sm font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm">Subtotal:</span>
                <span className="text-emerald-400 text-sm font-semibold">${total} USD</span>
              </div>
              {deliveryPrice > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 text-sm">Envío:</span>
                  <span className="text-amber-400 text-sm font-semibold">${deliveryPrice} CUP</span>
                </div>
              )}
              <div className="border-t border-zinc-700 pt-2 mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300 text-sm">Total Productos:</span>
                  <span className="text-emerald-400 font-bold">${total} USD</span>
                </div>
                {deliveryPrice > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300 text-sm">Total Envío:</span>
                    <span className="text-amber-400 font-bold">${deliveryPrice} CUP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1 block">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1 block">
                  Zona de entrega <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Seleccioná tu zona</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - ${zone.price.toLocaleString()}
                    </option>
                  ))}
                  <option value="other">Otra dirección (escribir manualmente)</option>
                </select>
              </div>

              {selectedZone === 'other' && (
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1 block">
                    Dirección completa <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={e => setCustomAddress(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="Escribí tu dirección completa"
                  />
                  <p className="text-amber-400 text-xs mt-1">
                    ⚠ El costo de envío se coordinará por WhatsApp
                  </p>
                </div>
              )}

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1 block">
                  Hora para retirar el pedido <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="Ej: Mañana a las 15:00hs"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1 block">
                  Notas adicionales <span className="text-zinc-600">(opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                  placeholder="Algún detalle especial..."
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !name || !selectedZone || !pickupTime || (selectedZone === 'other' && !customAddress)}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.32-2.234l-.442-.364-3.09 1.036 1.036-3.09-.364-.442A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  {submitting ? 'Enviando...' : 'Enviar por WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Copiar mensaje al portapapeles como fallback
                    const msg = generateMessage();
                    navigator.clipboard.writeText(msg);
                    alert('✓ Mensaje copiado al portapapeles. Ahora puedes pegarlo en WhatsApp.');
                  }}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar mensaje (fallback)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors py-2.5"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
