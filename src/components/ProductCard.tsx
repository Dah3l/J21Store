import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import JerseyImage from './JerseyImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getQuantityInCart, getRemainingStock } = useCart();
  const [feedback, setFeedback] = useState<'added' | 'limit' | null>(null);

  const quantityInCart = getQuantityInCart(product.id);
  const remaining = getRemainingStock(product);
  const isOutOfStock = product.stock <= 0;
  const isStockLimitReached = !isOutOfStock && remaining <= 0;

  const handleAdd = () => {
    if (isOutOfStock || isStockLimitReached) return;

    const success = addItem(product);
    if (success) {
      setFeedback('added');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // Mostrar feedback de límite alcanzado cuando cambia
  const showLimitFeedback = feedback === 'limit';

  // Detectar cuando se alcanza el límite tras agregar
  const checkAndShowLimit = () => {
    const newRemaining = product.stock - (quantityInCart + 1);
    if (newRemaining <= 0 && quantityInCart > 0) {
      setFeedback('limit');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const handleAddWithCheck = () => {
    if (isOutOfStock || isStockLimitReached) return;

    const success = addItem(product);
    if (success) {
      // Verificar si después de agregar se alcanzó el límite
      const newRemaining = product.stock - (quantityInCart + 1);
      if (newRemaining <= 0) {
        setFeedback('limit');
        setTimeout(() => setFeedback(null), 2500);
      } else {
        setFeedback('added');
        setTimeout(() => setFeedback(null), 1200);
      }
    }
  };

  return (
    <div className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="aspect-square overflow-hidden bg-zinc-800 relative">
        <JerseyImage
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 font-bold text-lg">Sin stock</span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 3 && quantityInCart === 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            ¡Últimas {product.stock}!
          </div>
        )}
        {quantityInCart > 0 && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {quantityInCart} en carrito
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{product.team}</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-400 text-xs">Talla: {product.size}</span>
          <span className="text-white font-bold text-lg">${product.price.toLocaleString()}</span>
        </div>
        {!isOutOfStock && (
          <p className="text-zinc-500 text-xs mb-3">
            {remaining > 0
              ? `Disponibles: ${remaining} de ${product.stock}`
              : 'Máximo alcanzado'}
          </p>
        )}
        {(isOutOfStock || isStockLimitReached) && <div className="mb-3" />}
        <button
          onClick={handleAddWithCheck}
          disabled={isOutOfStock || isStockLimitReached}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            feedback === 'added'
              ? 'bg-emerald-500 text-black'
              : feedback === 'limit'
              ? 'bg-amber-500 text-black'
              : isOutOfStock || isStockLimitReached
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
          }`}
        >
          {feedback === 'added'
            ? '✓ Agregado'
            : feedback === 'limit'
            ? '⚠ Stock máximo'
            : isOutOfStock
            ? 'Sin stock'
            : isStockLimitReached
            ? 'Máximo en carrito'
            : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
