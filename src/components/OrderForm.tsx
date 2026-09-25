import { useState } from 'react';
import { CartItem, DEFAULT_WHATSAPP_NUMBER } from '../types';
import { useBusiness } from '../context/BusinessContext';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSuccess: () => void;
}

export default function OrderForm({ isOpen, onClose, items, total, onSuccess }: OrderFormProps) {
  const { settings } = useBusiness();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Generar mensaje de WhatsApp con los datos del formulario
    let message = `🛒 *Nuevo Pedido - ${settings.business_name}*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Dirección:* ${address}\n`;
    message += `🕐 *Hora de retiro:* ${pickupTime}\n\n`;
    message += `📦 *Productos:*\n`;
    
    items.forEach(item => {
      message += `• ${item.product.name} (${item.product.team})\n`;
      message += `  Talla: ${item.product.size} | Cant: ${item.quantity} | $${(item.product.price * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `💰 *Total: $${total.toLocaleString()}*\n`;
    
    if (notes.trim()) {
      message += `\n📝 *Notas:* ${notes}\n`;
    }
    
    message += `\n¡Hola! Me gustaría hacer este pedido.`;

    const encodedMessage = encodeURIComponent(message);
    const phone = settings.whatsapp_number || DEFAULT_WHATSAPP_NUMBER;
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    
    // Limpiar formulario y cerrar
    setName('');
    setAddress('');
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
              <div>
                <h2 className="text-xl font-bold text-white">Finalizar Pedido</h2>
                <p className="text-zinc-400 text-sm mt-1">Completá tus datos para continuar</p>
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
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Total:</span>
                <span className="text-emerald-400 text-lg font-bold">${total.toLocaleString()}</span>
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
                  Dirección <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="Av. Siempre Viva 1234, Buenos Aires"
                />
              </div>

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
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !name || !address || !pickupTime}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.32-2.234l-.442-.364-3.09 1.036 1.036-3.09-.364-.442A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  {submitting ? 'Enviando...' : 'Enviar por WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
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
