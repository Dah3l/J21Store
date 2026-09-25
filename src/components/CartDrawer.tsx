import { useState } from 'react';
import { useCart } from '../context/CartContext';
import JerseyImage from './JerseyImage';
import OrderForm from './OrderForm';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Bloquear scroll cuando el drawer está abierto
  useModalScrollLock(isOpen);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">🛒 Mi Carrito</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">&times;</button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center text-zinc-500 mt-12">
                <p className="text-4xl mb-3">🏟️</p>
                <p>Tu carrito está vacío</p>
                <p className="text-sm mt-1">Agrega camisetas para empezar</p>
              </div>
            ) : (
              items.map((item, index) => {
                const itemKey = `${item.product.id}-${item.selectedPlayer || ''}-${item.selectedSize || ''}`;
                
                // Calcular stock máximo para esta variante específica
                let maxStock = 0;
                if (item.selectedPlayer && item.product.variants) {
                  const variant = item.product.variants.find(v => v.player_name === item.selectedPlayer);
                  if (variant) {
                    maxStock = variant.stock || 0;
                  }
                }
                
                return (
                <div key={itemKey} className="flex gap-3 bg-zinc-800 rounded-lg p-3">
                  <JerseyImage
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-semibold truncate">{item.product.name}</h4>
                    <p className="text-zinc-400 text-xs">{item.product.team}</p>
                    {item.selectedPlayer && (
                      <p className="text-emerald-400 text-xs">👤 {item.selectedPlayer}</p>
                    )}
                    {item.selectedSize && (
                      <p className="text-zinc-400 text-xs">📏 Talla: {item.selectedSize}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedPlayer, item.selectedSize)}
                          className="w-6 h-6 rounded bg-zinc-700 text-white text-sm flex items-center justify-center hover:bg-zinc-600"
                        >−</button>
                        <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedPlayer, item.selectedSize)}
                          disabled={item.quantity >= maxStock}
                          title={item.quantity >= maxStock ? 'Stock máximo alcanzado' : ''}
                          className={`w-6 h-6 rounded text-sm flex items-center justify-center ${
                            item.quantity >= maxStock
                              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                              : 'bg-zinc-700 text-white hover:bg-zinc-600'
                          }`}
                        >+</button>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">${item.product.price * item.quantity} USD</span>
                    </div>
                    {item.quantity >= maxStock && (
                      <p className="text-amber-400 text-xs mt-1">⚠ Stock máximo</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedPlayer, item.selectedSize)}
                    className="text-zinc-500 hover:text-red-400 self-start"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Productos</span>
                <span className="text-emerald-400 text-2xl font-bold">${total} USD</span>
              </div>
              <p className="text-zinc-500 text-xs text-center">* Envío se calcula al finalizar el pedido</p>
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.32-2.234l-.442-.364-3.09 1.036 1.036-3.09-.364-.442A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Pedir por WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="w-full text-zinc-500 hover:text-red-400 text-sm py-2 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Form Modal */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        items={items}
        total={total}
        onSuccess={clearCart}
      />
    </>
  );
}
